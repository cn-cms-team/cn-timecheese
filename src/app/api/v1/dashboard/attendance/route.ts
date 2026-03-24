import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { endOfMonth, startOfMonth } from 'date-fns';

type Summary = {
  date: string;
  series: Array<{ name: string; data: number }>;
};

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const userId = searchParams.get('user_id');

  if (!month) {
    return Response.json({ message: 'Month parameter is required' }, { status: 400 });
  }

  if (!year) {
    return Response.json({ message: 'Year parameter is required' }, { status: 400 });
  }

  if (!userId) {
    return Response.json({ message: 'User ID parameter is required' }, { status: 400 });
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

  const monthStart = startOfMonth(new Date(yearNumber, monthNumber));
  const monthEnd = endOfMonth(new Date(yearNumber, monthNumber));

  try {
    const tasks = await prisma.timeSheetSummary.findMany({
      where: {
        user_id: userId,
        sum_date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        sum_date: true,
        total_seconds: true,
        project_id: true,
      },
      orderBy: {
        sum_date: 'asc',
      },
    });

    const projectIds = tasks.map((task) => task.project_id);
    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    // Group by date and sum total_seconds
    type Series = {
      name: string;
      data: number;
    };
    const summaryMap: Record<string, Array<Series>> = {};
    tasks.forEach((task) => {
      const dateKey = task.sum_date.toISOString().split('T')[0];
      const projectName = projects.find((project) => project.id === task.project_id)?.name!;
      if (!summaryMap[dateKey]) {
        summaryMap[dateKey] = [{ name: projectName, data: task.total_seconds }];
      } else {
        const existingProjectIndex = summaryMap[dateKey].findIndex((e) => e.name === projectName);
        if (existingProjectIndex !== -1) {
          summaryMap[dateKey][existingProjectIndex].data += task.total_seconds;
        } else {
          summaryMap[dateKey].push({ name: projectName, data: task.total_seconds });
        }
      }
    });

    const result: Summary[] = Object.entries(summaryMap).map(([date, series]) => ({
      date,
      series,
    }));

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
