import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { TaskTypeCode } from '../../../../../../../generated/prisma/enums';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const taskTypeId = id as TaskTypeCode;
  if (!taskTypeId) {
    return Response.json({ error: 'Task Type ID is required' }, { status: 400 });
  }
  try {
    const taskType = await prisma.taskType.findMany({
      where: { type: taskTypeId },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        is_active: true,
      },
    });
    return Response.json({ data: taskType, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await prisma.taskType.update({
      where: { id: body.data.id },
      data: { ...body.data },
    });

    return Response.json(
      {
        message: 'Update success',
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'Task Type ID is required' }, { status: 400 });
    }

    const timeSheet = await prisma.projectTaskType.findFirst({
      where: { task_type_id: id },
    });
    if (timeSheet) {
      return Response.json({ message: 'This task type have been used' }, { status: 402 });
    }

    const result = await prisma.taskType.delete({
      where: { id },
    });

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
