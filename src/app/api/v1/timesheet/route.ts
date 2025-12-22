import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const timeSheets = await prisma.timeSheet.findMany({
      where: { user_id: session.user?.id },
      orderBy: { stamp_date: 'asc' },
    });

    return Response.json({ data: timeSheets }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const result = await prisma.timeSheet.create({
      data: {
        user_id: session.user?.id,
        project_id: body.data.project_id as string,
        task_type_id: body.data.task_type_id as string,
        stamp_date: new Date(),
        start_date: body.data.start_date,
        end_date: body.data.end_date,
        detail: body.data.detail as string,
        remark: body.data.remark as string | null,
        total_seconds: body.data.total_seconds as number,
      },
    });

    return Response.json(
      {
        message: 'Create successfully',
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
