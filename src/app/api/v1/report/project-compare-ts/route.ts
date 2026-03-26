import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const MIN_YEAR = 2000;
const MAX_YEAR = 2600;

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const monthParam = Number(searchParams.get('month'));
    const yearParam = Number(searchParams.get('year'));

    if (
      Number.isNaN(monthParam) ||
      Number.isNaN(yearParam) ||
      monthParam < 0 ||
      monthParam > 11 ||
      yearParam < MIN_YEAR ||
      yearParam > MAX_YEAR
    ) {
      return Response.json({ message: 'Invalid month or year' }, { status: 400 });
    }

    // sum_date is a date-only field. Use explicit UTC boundaries to avoid timezone drift.
    const startDate = new Date(Date.UTC(yearParam, monthParam, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(yearParam, monthParam + 1, 0, 23, 59, 59, 999));

    const grouped = await prisma.timeSheetSummary.groupBy({
      where: {
        is_approved: true,
        sum_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      by: ['project_id'],
      _sum: {
        total_seconds: true,
      },
    });

    const projectIds = grouped.map((item) => item.project_id);

    const projects =
      projectIds.length > 0
        ? await prisma.project.findMany({
            where: {
              id: { in: projectIds },
              is_enabled: true,
            },
            select: {
              id: true,
              name: true,
              code: true,
            },
          })
        : [];

    const projectMap = new Map(projects.map((project) => [project.id, project]));

    const result = grouped
      .map((item) => {
        const totalSeconds = item._sum.total_seconds ?? 0;
        const project = projectMap.get(item.project_id);

        return {
          project_id: item.project_id,
          project_name: project?.name ?? 'Unknown Project',
          project_code: project?.code ?? '',
          total_seconds: totalSeconds,
          total_hours: Number((totalSeconds / 3600).toFixed(2)),
        };
      })
      .sort((a, b) => b.total_seconds - a.total_seconds);

    // remove projects with zero hours
    const filteredResult = result.filter((item) => item.total_seconds > 0);

    return Response.json({ data: filteredResult }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
