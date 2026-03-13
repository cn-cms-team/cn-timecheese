import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request, { params }: { params: Promise<{ date: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorize', status: 401 });
    }

    const { date } = await params;
    if (!date) {
      return Response.json({ error: 'Date is required' }, { status: 400 });
    }

    const timeSheet = await prisma.timeSheet.findMany({
      where: {
        user_id: session.user.id,
        stamp_date: new Date(date),
      },
      select: {
        id: true,
        stamp_date: true,
        start_date: true,
        end_date: true,
        exclude_seconds: true,
        total_seconds: true,
        detail: true,
        project_id: true,
        project_task_type_id: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        project_task_type: {
          select: {
            id: true,
            type: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: { start_date: 'asc' },
    });

    const result = timeSheet.map((item) => ({
      id: item.id,
      stamp_date: item.stamp_date.toISOString().split('T')[0], // dayId
      start_date: item.start_date, // startTime
      end_date: item.end_date, // endTime
      total_seconds: item.total_seconds,
      exclude_seconds: item.exclude_seconds,
      project_id: item.project_id,
      project_task_type_id: item.project_task_type_id,
      project_name: item.project.name, // title
      detail: item.detail, // description
      task_type_name: item?.project_task_type?.name, // category
      tone: 'blue',
    }));

    return Response.json({ data: result, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
