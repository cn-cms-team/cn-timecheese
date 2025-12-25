import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user?.id) {
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
    const result = await prisma.timeSheet.update({
      where: { id: id as string },
      data: {
        project_id: data.project_id as string,
        task_type_id: data.task_type_id as string,
        start_date: data.start_date,
        end_date: data.end_date,
        detail: data.detail as string,
        exclude_seconds: body.data.exclude_seconds as number,
        total_seconds: total_seconds,
      },
    });

    return Response.json(
      {
        message: 'Update successfully',
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

    return Response.json(
      {
        message: `Delete successfully `,
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
