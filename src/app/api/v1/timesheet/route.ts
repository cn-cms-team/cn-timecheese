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

    const projects = await prisma.project.findMany({
      where: { id: { in: timeSheets.map((ts) => ts.project_id) } },
      select: {
        id: true,
        name: true,
      },
    });

    const taskType = await prisma.taskType.findMany({
      where: { id: { in: timeSheets.map((ts) => ts.task_type_id) } },
      select: {
        id: true,
        name: true,
      },
    });

    const result = timeSheets.map((ts) => {
      const project = projects.find((p) => p.id === ts.project_id);
      const task = taskType.find((t) => t.id === ts.task_type_id);

      return {
        ...ts,
        project_name: project ? project.name : null,
        task_type_name: task ? task.name : null,
      };
    });

    return Response.json({ data: result }, { status: 200 });
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
  const start = new Date(body.data.start_date);
  const end = new Date(body.data.end_date);

  const total_seconds = Math.floor((end.getTime() - start.getTime()) / 1000);

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
        total_seconds: total_seconds as number,
      },
    });

    return Response.json(
      {
        message: 'Create Task successfully',
        data: { id: result.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
