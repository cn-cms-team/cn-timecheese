import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { endOfMonth, startOfMonth } from 'date-fns';

type RouteContext = { params: Promise<{ id: string }> };

type AttendanceSummary = {
  date: string;
  series: Array<{ name: string; data: number }>;
};

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
    const canViewProject = await prisma.projectReportMember.findFirst({
      where: {
        user_id: session.user.id,
        project_id: projectId,
        project: { is_enabled: true },
      },
      select: { project_id: true },
    });

    if (!canViewProject) {
      return Response.json({ message: 'Forbidden' }, { status: 403 });
    }

    const monthStart = startOfMonth(new Date(yearNumber, monthNumber));
    const monthEnd = endOfMonth(new Date(yearNumber, monthNumber));

    const tasks = await prisma.timeSheetSummary.findMany({
      where: {
        project_id: projectId,
        sum_date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        sum_date: true,
        total_seconds: true,
      },
      orderBy: {
        sum_date: 'asc',
      },
    });

    const dailySummary = new Map<string, number>();

    tasks.forEach((task) => {
      const dateKey = task.sum_date.toISOString().split('T')[0];
      const currentValue = dailySummary.get(dateKey) || 0;
      dailySummary.set(dateKey, currentValue + task.total_seconds);
    });

    const result: AttendanceSummary[] = Array.from(dailySummary.entries()).map(([date, total]) => ({
      date,
      series: [{ name: 'รวมทั้งโครงการ', data: total }],
    }));

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
