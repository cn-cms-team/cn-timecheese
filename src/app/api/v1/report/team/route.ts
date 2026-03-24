import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return Response.json({ message: 'User ID is required' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId, is_enabled: true },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        code: true,
        position_level: {
          select: {
            id: true,
            name: true,
          },
        },
        start_date: true,
        team_id: true,
      },
    });

    if (!currentUser) return Response.json({ message: 'User not found' }, { status: 404 });
    if (currentUser.team_id !== session.user.team_id) {
      return Response.json({ message: 'User not in your team' }, { status: 403 });
    }

    const projectCompany = await prisma.project.findMany({
      where: {
        is_enabled: true,
        is_company_project: true,
        OR: [
          { end_date: { gte: new Date() } },
          { end_date: null },
          { maintenance_end_date: { gte: new Date() } },
        ],
      },
      select: {
        id: true,
        name: true,
        code: true,
        start_date: true,
        end_date: true,
        maintenance_start_date: true,
        maintenance_end_date: true,
        value: true,
        projectMembers: {
          where: { user_id: currentUser.id },
          select: {
            role: true,
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    const projectCustomer = await prisma.projectMember.findMany({
      where: {
        user_id: currentUser.id,
        project: {
          is_enabled: true,
          is_company_project: false,
          OR: [
            { end_date: { gte: new Date() } },
            { end_date: null },
            { maintenance_end_date: { gte: new Date() } },
          ],
        },
      },
      select: {
        role: true,
        start_date: true,
        end_date: true,
        project: {
          select: {
            id: true,
            name: true,
            code: true,
            start_date: true,
            end_date: true,
            maintenance_start_date: true,
            maintenance_end_date: true,
            value: true,
          },
        },
      },
    });

    const userProjects = [
      ...projectCompany,
      ...projectCustomer.map((member) => ({
        ...member.project,
        projectMembers: [
          {
            role: member.role,
            start_date: member.start_date,
            end_date: member.end_date,
          },
        ],
      })),
    ];

    const timeSheetSummary = await prisma.timeSheetSummary.findMany({
      where: {
        user_id: currentUser.id,
      },
      select: {
        project_id: true,
        total_seconds: true,
        stamp_at: true,
      },
    });

    const timeSheetSummaryMap = timeSheetSummary.reduce(
      (map, summary) => {
        map[summary.project_id] = (map[summary.project_id] || 0) + summary.total_seconds;
        return map;
      },
      {} as Record<string, number>
    );

    const lastStampAtMap = timeSheetSummary.reduce(
      (map, summary) => {
        if (
          !map[summary.project_id] ||
          new Date(summary.stamp_at) > new Date(map[summary.project_id])
        ) {
          map[summary.project_id] = summary.stamp_at.toISOString();
        }
        return map;
      },
      {} as Record<string, string>
    );

    const projects = userProjects.map((project) => {
      const memberInfo = project.projectMembers[0];

      return {
        id: project.id,
        name: project.name,
        code: project.code,
        start_date: memberInfo?.start_date ?? project.start_date,
        end_date: memberInfo?.end_date ?? project.end_date,
        maintenance_start_date: project.maintenance_start_date,
        maintenance_end_date: project.maintenance_end_date,
        value: project.value,
        position: memberInfo?.role ?? '-',
        join_date: lastStampAtMap[project.id],
        spent_times: timeSheetSummaryMap[project.id] ?? 0,
      };
    });

    const projectsSpentTimesMoreThanZero = projects.filter((project) => project.spent_times > 0);

    return Response.json(
      { data: { user: currentUser, projects: projectsSpentTimesMoreThanZero } },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
