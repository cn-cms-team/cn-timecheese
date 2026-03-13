import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { TimeSheetsRequest } from '@/types/timesheet';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorize', status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryStartDate = searchParams.get('startDate');
    const queryEndDate = searchParams.get('endDate');

    let data: TimeSheetsRequest;

    if (queryStartDate && queryEndDate) {
      data = {
        startDate: queryStartDate,
        endDate: queryEndDate,
      };
    } else {
      const rawBody = await request.text();
      const body = rawBody ? (JSON.parse(rawBody) as { data?: TimeSheetsRequest }) : {};

      if (!body.data?.startDate || !body.data?.endDate) {
        return Response.json(
          { message: 'Missing startDate or endDate', status: 400 },
          { status: 400 }
        );
      }

      data = body.data;
    }

    const tsSummary = await prisma.timeSheetSummary.findMany({
      where: {
        user_id: session.user.id,
        sum_date: {
          gte: startOfDay(new Date(data.startDate)),
          lte: endOfDay(new Date(data.endDate)),
        },
      },

      select: {
        total_seconds: true,
        sum_date: true,
      },
    });

    const hourData: Record<string, number> = {};
    tsSummary.forEach((item) => {
      const dateKey = item.sum_date.toISOString().split('T')[0];
      hourData[dateKey] = (hourData[dateKey] || 0) + item.total_seconds / 3600;
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
