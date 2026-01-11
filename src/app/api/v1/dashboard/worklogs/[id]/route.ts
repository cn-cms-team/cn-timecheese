import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const userId = (await params).id;
  if (!userId) {
    return Response.json({ error: 'User ID parameter is required' }, { status: 400 });
  }

  const search = searchParams.get('search')?.trim() || '';
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const projectId = searchParams.get('project_id');
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  if (!projectId) {
    return Response.json({ error: 'Project ID parameter is required' }, { status: 400 });
  }

  //ใช้ en-CA เพื่อทำให้รูปแบบ ISO โดยไม่แปลงเป็น UTC
  const startDateOnly = start_date
    ? new Date(start_date).toLocaleDateString('en-CA').split('T')[0]
    : null;

  const endDateOnly = end_date
    ? new Date(end_date).toLocaleDateString('en-CA').split('T')[0]
    : null;

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
        ...(startDateOnly &&
          endDateOnly && {
            stamp_date: {
              gte: startDateOnly,
              lte: endDateOnly,
            },
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
        ...(startDateOnly &&
          endDateOnly && {
            stamp_date: {
              gte: startDateOnly,
              lte: endDateOnly,
            },
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
          stamp_date: 'asc',
        },
        {
          start_date: 'asc',
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

    return Response.json({ data, total_items: totalTask }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
