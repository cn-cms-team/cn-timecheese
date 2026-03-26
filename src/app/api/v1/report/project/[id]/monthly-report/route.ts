import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { endOfMonth, startOfMonth } from 'date-fns';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id: projectId } = await params;
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (!projectId) {
    return Response.json({ message: 'Project ID parameter is required' }, { status: 400 });
  }

  if (!month) {
    return Response.json({ message: 'Month parameter is required' }, { status: 400 });
  }

  if (!year) {
    return Response.json({ message: 'Year parameter is required' }, { status: 400 });
  }

  const monthNumber = Number(month);
  const yearNumber = Number(year);

  if (isNaN(monthNumber) || monthNumber < 0 || monthNumber > 11) {
    return Response.json(
      { message: 'Invalid month parameter. Must be between 0 and 11' },
      { status: 400 }
    );
  }

  if (isNaN(yearNumber)) {
    return Response.json({ message: 'Invalid year parameter' }, { status: 400 });
  }

  try {
    const monthStart = startOfMonth(new Date(yearNumber, monthNumber));
    const monthEnd = endOfMonth(new Date(yearNumber, monthNumber));

    const projectSelected = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        is_company_project: true,
      },
    });

    if (!projectSelected) {
      return Response.json({ message: 'Project not found' }, { status: 404 });
    }

    let projectMembers = [];
    if (projectSelected.is_company_project) {
      const users = await prisma.user.findMany({
        where: {
          is_active: true,
          is_enabled: true,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          team: {
            select: {
              name: true,
            },
          },
        },
      });

      projectMembers = users.map((user) => {
        return {
          user_id: user.id,
          project_id: projectSelected.id,
          project: {
            name: projectSelected.name,
            code: projectSelected.code,
          },
          user: {
            first_name: user.first_name,
            last_name: user.last_name,
            team: {
              name: user.team?.name,
            },
          },
        };
      });
    } else {
      projectMembers = await prisma.projectMember.findMany({
        where: {
          project_id: projectId,
        },
        select: {
          user_id: true,
          project_id: true,
          project: {
            select: {
              name: true,
              code: true,
            },
          },
          user: {
            select: {
              first_name: true,
              last_name: true,
              team: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    }

    const projectTimeSheets = await prisma.timeSheetSummary.findMany({
      where: {
        project_id: projectId,
        sum_date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        user_id: true,
        project_id: true,
        sum_date: true,
        total_seconds: true,
      },
      orderBy: {
        sum_date: 'asc',
      },
    });

    const result = {
      project_name: projectMembers[0].project.name,
      project_code: projectMembers[0].project.code,
      month: monthNumber,
      year: yearNumber,
      members: projectMembers
        .map((member) => {
          const userTimeSheets = projectTimeSheets.filter(
            (timeSheet) => timeSheet.user_id === member.user_id
          );
          return {
            user_name: `${member.user.first_name} ${member.user.last_name}`,
            team_name: member.user.team?.name,
            timeSheets: userTimeSheets.reduce((acc, timeSheet) => acc + timeSheet.total_seconds, 0),
          };
        })
        .sort((a, b) => {
          return a.team_name!.localeCompare(b.team_name!) || b.timeSheets - a.timeSheets;
        }),
    };

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
