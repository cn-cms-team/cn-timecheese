import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { ...data } = body.data;

  if (!id) {
    return Response.json({ error: 'Task ID is required' }, { status: 400 });
  }

  const start = new Date(body.data.start_date);
  const end = new Date(body.data.end_date);
  const total_seconds = Math.floor((end.getTime() - start.getTime()) / 1000);

  try {
    const task = await prisma.timeSheet.findUnique({
      where: { id: id },
      select: { total_seconds: true },
    });

    if (!task) {
      return Response.json({ error: `Task not found` }, { status: 404 });
    }

    const result = await prisma.timeSheet.update({
      where: {
        id: id,
      },
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

    let isIncrement: boolean | null = null;
    const currentTotalSecond = total_seconds;
    const oldTotalSecond = task.total_seconds;

    switch (true) {
      case oldTotalSecond > currentTotalSecond:
        isIncrement = false;
        break;
      case oldTotalSecond < currentTotalSecond:
        isIncrement = true;
        break;
      default:
        isIncrement = null;
        break;
    }

    const diffSeconds = Math.abs(currentTotalSecond - oldTotalSecond);

    const resUpdateSummary = await prisma.timeSheetSummary.update({
      where: {
        user_id_project_id_year: {
          user_id: session.user.id,
          project_id: data.project_id,
          year: start.getFullYear(),
        },
      },
      data: {
        ...(diffSeconds !== 0 && {
          total_seconds: isIncrement ? { increment: diffSeconds } : { decrement: diffSeconds },
        }),
        updated_at: new Date(),
      },
    });

    if (!resUpdateSummary) {
      return Response.json({ error: 'Failed to update timesheet summary' }, { status: 500 });
    }

    return Response.json(
      {
        message: 'Update success',
        data: { id: result.id },
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const result = await prisma.timeSheet.delete({
      where: { id: id as string },
    });

    const resSummary = await prisma.timeSheetSummary.update({
      where: {
        user_id_project_id_year: {
          user_id: session.user.id,
          project_id: result.project_id,
          year: result.start_date.getFullYear(),
        },
      },
      data: {
        total_seconds: {
          decrement: result.total_seconds,
        },
        updated_at: new Date(),
      },
    });

    if (!resSummary) {
      return Response.json(
        { error: `Failed to update timesheet summary by deleting task_id: ${id}` },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: `Delete success `,
        data: { id: result.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
