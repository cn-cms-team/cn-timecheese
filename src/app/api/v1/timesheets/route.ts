import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { TimeSheetsRequest } from '@/types/timesheet';
import { parseDate, toUtcDayBounds } from '@/lib/functions/date-format';

type TimeSheetBody = {
  data?: TimeSheetsRequest;
};

async function extractRequestDates(request: Request): Promise<TimeSheetsRequest | null> {
  const { searchParams } = new URL(request.url);
  const queryStartDate = searchParams.get('startDate');
  const queryEndDate = searchParams.get('endDate');

  if (queryStartDate && queryEndDate) {
    return {
      startDate: queryStartDate,
      endDate: queryEndDate,
    };
  }

  const rawBody = await request.text();
  if (!rawBody) {
    return null;
  }

  const body = JSON.parse(rawBody) as TimeSheetBody;
  if (!body.data?.startDate || !body.data?.endDate) {
    return null;
  }

  return body.data;
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let data: TimeSheetsRequest | null;
    try {
      data = await extractRequestDates(request);
    } catch {
      return Response.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    if (!data?.startDate || !data?.endDate) {
      return Response.json({ message: 'Missing startDate or endDate' }, { status: 400 });
    }

    const parsedStartDate = parseDate(data.startDate);
    const parsedEndDate = parseDate(data.endDate);

    if (!parsedStartDate || !parsedEndDate) {
      return Response.json({ message: 'Invalid startDate or endDate' }, { status: 400 });
    }

    const { start, end } = toUtcDayBounds(parsedStartDate, parsedEndDate);

    const tsSummary = await prisma.timeSheetSummary.findMany({
      where: {
        user_id: session.user.id,
        sum_date: {
          gte: start,
          lte: end,
        },
      },

      select: {
        total_seconds: true,
        sum_date: true,
      },
    });

    const holidays = await prisma.holiday.findMany({
      where: {
        is_enabled: true,
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        date: true,
        name: true,
      },
    });

    const hourData = tsSummary.reduce<Record<string, number>>((acc, item) => {
      const dateKey = item.sum_date.toISOString().split('T')[0];
      acc[dateKey] = (acc[dateKey] || 0) + item.total_seconds / 3600;
      return acc;
    }, {});

    const holidayDates = holidays.map((holiday) => holiday.date.toISOString().split('T')[0]);
    const holidayNamesByDate = holidays.reduce<Record<string, string>>((acc, holiday) => {
      const dateKey = holiday.date.toISOString().split('T')[0];
      acc[dateKey] = holiday.name;
      return acc;
    }, {});

    return Response.json({ data: { hourData, holidayDates, holidayNamesByDate } }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
