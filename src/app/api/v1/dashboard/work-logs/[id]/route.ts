import prisma from '@/lib/prisma';
import { toDateOnly, toUtcDayBoundary } from '@/lib/functions/date-format';
import { Prisma } from '@generated/prisma/client';

type RouteContext = { params: Promise<{ id: string }> };

const parsePositiveInt = (value: string | null, fallback: number) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { searchParams } = new URL(request.url);
  const { id: userId } = await params;

  if (!userId) {
    return Response.json({ message: 'User ID parameter is required' }, { status: 400 });
  }

  const projectId = searchParams.get('project_id');
  if (!projectId) {
    return Response.json({ message: 'Project ID parameter is required' }, { status: 400 });
  }

  const search = searchParams.get('search')?.trim() ?? '';
  const startDateOnly = toDateOnly(searchParams.get('start_date'));
  const endDateOnly = toDateOnly(searchParams.get('end_date'));

  const page = parsePositiveInt(searchParams.get('page'), 1);
  const limit = parsePositiveInt(searchParams.get('limit'), 10);
  const skip = (page - 1) * limit;

  const stampDateFilter =
    startDateOnly && endDateOnly
      ? {
          gte: toUtcDayBoundary(startDateOnly),
          lte: toUtcDayBoundary(endDateOnly, true),
        }
      : undefined;

  const where: Prisma.TimeSheetWhereInput = {
    user_id: userId,
    project_id: projectId,
    ...(search && {
      OR: [
        {
          project_task_type: {
            name: { contains: search },
          },
        },
        {
          detail: { contains: search },
        },
      ],
    }),
    ...(stampDateFilter && { stamp_date: stampDateFilter }),
  };

  try {
    const [totalItems, tasks] = await Promise.all([
      prisma.timeSheet.count({ where }),
      prisma.timeSheet.findMany({
        where,
        select: {
          id: true,
          project_task_type: true,
          stamp_date: true,
          start_date: true,
          end_date: true,
          total_seconds: true,
          exclude_seconds: true,
          detail: true,
          remark: true,
          is_work_from_home: true,
          is_approved: true,
        },
        orderBy: [{ stamp_date: 'desc' }, { start_date: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    const data = tasks.map((task) => ({
      date: task.stamp_date.toISOString(),
      start_time: task.start_date.toISOString(),
      end_time: task.end_date.toISOString(),
      break_hours: task.exclude_seconds ?? null,
      tracked_hours: task.total_seconds,
      task_type: task.project_task_type?.name ?? null,
      detail: task.detail,
      remark: task.remark,
      is_work_from_home: task.is_work_from_home,
      is_approved: task.is_approved,
    }));

    return Response.json({ data, total_items: totalItems }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
