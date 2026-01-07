import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!month) {
    return Response.json({ error: 'Month parameter is required' }, { status: 400 });
  }

  const year = new Date().getFullYear() - 1;
  const monthNumber = Number(month);

  if (isNaN(monthNumber) || monthNumber < 0 || monthNumber > 11) {
    return Response.json(
      { error: 'Invalid month parameter. Must be between 0 and 11' },
      { status: 400 }
    );
  }

  const startOfMonth = new Date(year, monthNumber, 1);
  const endOfMonth = new Date(year, monthNumber + 1, 0, 23, 59, 59);

  try {
    const tasks = await prisma.timeSheet.findMany({
      where: {
        stamp_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        id: true,
        project_task_type: true,
        stamp_date: true,
        start_date: true,
        end_date: true,
        total_seconds: true,
      },
      orderBy: {
        stamp_date: 'asc',
      },
    });

    type Summary = {
      date: string;
      task_name?: string;
      total_seconds: number;
    };

    const summaryMap = new Map<string, Summary>();

    for (const task of tasks) {
      const dateKey = task.stamp_date.toISOString().split('T')[0];

      if (!summaryMap.has(dateKey)) {
        summaryMap.set(dateKey, {
          date: dateKey,
          total_seconds: 0,
        });
      }

      summaryMap.get(dateKey)!.total_seconds += task.total_seconds;
    }

    const result = Array.from(summaryMap.values());

    return Response.json({ data: result, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
