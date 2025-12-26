import { auth } from '@/auth';
import { PERIODCALENDAR } from '@/lib/constants/period-calendar';
import prisma from '@/lib/prisma';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const period = searchParams.get('period');
  const date = searchParams.get('date');
  const year = Number(searchParams.get('year'));
  const month = Number(searchParams.get('month'));

  let dateFilter: { gte?: Date; lte?: Date } = {};

  if (period === PERIODCALENDAR.WEEK && date) {
    const baseDate = new Date(date);
    dateFilter = {
      gte: startOfWeek(baseDate, { weekStartsOn: 0 }),
      lte: endOfWeek(baseDate, { weekStartsOn: 0 }),
    };
  }

  if (period === PERIODCALENDAR.MONTH && year && month >= 0) {
    const baseDate = new Date(year, month, 1);
    dateFilter = {
      gte: startOfMonth(baseDate),
      lte: endOfMonth(baseDate),
    };
  }

  try {
    const timeSheets = await prisma.timeSheet.findMany({
      where: {
        user_id: session.user.id,
        ...(dateFilter.gte && { stamp_date: dateFilter }),
      },
      orderBy: { start_date: 'asc' },
      select: {
        id: true,
        project_id: true,
        stamp_date: true,
        start_date: true,
        end_date: true,
        detail: true,
        remark: true,
        total_seconds: true,
        exclude_seconds: true,
        project_task_type_id: true,
        project: {
          select: {
            name: true,
          },
        },
        project_task_type: {
          select: {
            name: true,
          },
        },
      },
    });

    const result = timeSheets.map((ts) => ({
      id: ts.id,
      project_id: ts.project_id,
      stamp_date: ts.stamp_date,
      start_date: ts.start_date,
      end_date: ts.end_date,
      detail: ts.detail,
      remark: ts.remark,
      exclude_seconds: ts.exclude_seconds,
      total_seconds: ts.total_seconds,
      project_name: ts.project?.name ?? null,
      task_type_name: ts.project_task_type?.name ?? null,
      project_task_type_id: ts.project_task_type_id,
    }));

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const data = body.data;
  const start = new Date(body.data.start_date);
  const end = new Date(body.data.end_date);

  const total_seconds = Math.floor((end.getTime() - start.getTime()) / 1000);

  try {
    const result = await prisma.timeSheet.create({
      data: {
        user_id: session.user.id,
        project_id: data.project_id,
        project_task_type_id: data.project_task_type_id,
        stamp_date: data.stamp_date,
        start_date: start,
        end_date: end,
        detail: data.detail || '',
        exclude_seconds: data.exclude_seconds ?? 0,
        total_seconds,
      },
    });

    return Response.json(
      { message: 'Create Task successfully', data: { id: result.id } },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
