import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { TimeSheetsRequest } from '@/types/timesheet';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorize', status: 401 });
    }

    const body = await request.json();
    const data = body.data as TimeSheetsRequest;
    const tsSummary = await prisma.timeSheetSummary.findMany({
      where: {
        user_id: session.user.id,
        sum_date: {
          gte: new Date(data.startDate),
          lte: new Date(data.endDate),
        },
      },

      select: {
        total_seconds: true,
        sum_date: true,
      },
    });

    // Transform the data into grouped sum_date with total_seconds and return as response Record<string, number> key is date in format YYYY-MM-DD and value is total_seconds
    const hourData: Record<string, number> = {};
    tsSummary.forEach((item) => {
      const dateKey = item.sum_date.toISOString().split('T')[0];
      hourData[dateKey] = (hourData[dateKey] || 0) + item.total_seconds;
    });
    const result = { hourData };

    return Response.json({ data: result, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
