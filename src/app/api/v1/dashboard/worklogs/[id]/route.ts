import prisma from '@/lib/prisma';
import { toDateOnly, toUtcDayBoundary } from '@/lib/functions/date-format';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const userId = (await params).id;
  if (!userId) {
    return Response.json({ message: 'User ID parameter is required' }, { status: 400 });
  }

  const search = searchParams.get('search')?.trim() || '';
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const projectId = searchParams.get('project_id');
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  if (!projectId) {
    return Response.json({ message: 'Project ID parameter is required' }, { status: 400 });
  }

  const startDateOnly = toDateOnly(start_date);
  const endDateOnly = toDateOnly(end_date);

  console.log('date range:', { startDateOnly, endDateOnly });

  const stampDateFilter =
    startDateOnly && endDateOnly
      ? {
          gte: toUtcDayBoundary(startDateOnly),
          lte: toUtcDayBoundary(endDateOnly, true),
        }
      : undefined;

  try {
    const totalTask = await prisma.timeSheet.count({
      where: {
        user_id: userId,
        project_id: projectId,
        ...(search && {
          OR: [
            {
              project_task_type: {
                name: {
                  contains: search,
                },
              },
            },
            {
              detail: {
                contains: search,
              },
            },
          ],
        }),
        ...(stampDateFilter && {
          stamp_date: stampDateFilter,
        }),
      },
    });

    const tasks = await prisma.timeSheet.findMany({
      where: {
        user_id: userId,
        project_id: projectId,
        ...(search && {
          OR: [
            {
              project_task_type: {
                name: {
                  contains: search,
                },
              },
            },
            {
              detail: {
                contains: search,
              },
            },
          ],
        }),
        ...(stampDateFilter && {
          stamp_date: stampDateFilter,
        }),
      },
      select: {
        id: true,
        project_task_type: true,
        stamp_date: true,
        start_date: true,
        end_date: true,
        total_seconds: true,
        exclude_seconds: true,
        detail: true,
      },
      orderBy: [
        {
          stamp_date: 'desc',
        },
        {
          start_date: 'desc',
        },
      ],
      skip,
      take: limit,
    });

    const data = tasks.map((task) => ({
      date: task.stamp_date.toISOString(),
      start_time: task.start_date.toISOString(),
      end_time: task.end_date.toISOString(),
      break_hours: task.exclude_seconds || null,
      tracked_hours: task.total_seconds,
      task_type: task.project_task_type?.name,
      detail: task.detail,
    }));

    return Response.json({ data, total_items: totalTask || 0 }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
