import prisma from '@/lib/prisma';
import { IProject } from '@/types/setting/project';
import { NextRequest } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id, is_enabled: true },
      select: {
        id: true,
        code: true,
        name: true,
        start_date: true,
        end_date: true,
        description: true,
        value: true,
        people_cost: true,
        people_cost_percent: true,
        status: true,
        projectMembers: {
          select: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
            user_id: true,
            role: true,
            day_price: true,
            start_date: true,
            end_date: true,
          },
        },
        projectTaskTypes: {
          select: {
            id: true,
            name: true,
            type: true,
            task_type_id: true,
            description: true,
          },
        },
      },
    });

    if (!project) {
      return Response.json({ error: 'ไม่พบข้อมูลโครงการ', status: 404 });
    }

    const referenceMember = await prisma.timeSheet.findMany({
      where: { project_id: id },
      select: {
        user_id: true,
      },
      distinct: 'user_id',
    });

    const referenceTask = await prisma.timeSheet.findMany({
      where: { project_id: id },
      select: {
        id: true,
      },
      distinct: 'id',
    });

    const usingUserIds = new Set(referenceMember.map((r) => r.user_id));
    const usingTaskTypeIds = new Set(referenceTask.filter((r) => r.id).map((r) => r.id));

    const result = {
      id: project.id,
      code: project.code,
      name: project.name,
      start_date: project.start_date,
      end_date: project.end_date,
      description: project.description,
      value: project.value,
      people_cost: project.people_cost,
      people_cost_percent: project.people_cost_percent,
      status: project.status,
      member: project.projectMembers.map(({ user, ...rest }) => ({
        ...rest,
        name: `${user.first_name} ${user.last_name}`,
        is_using: usingUserIds.has(rest.user_id),
      })),
      main_task_type: project.projectTaskTypes
        .filter((f) => f.task_type_id)
        .map((item) => ({
          ...item,
          is_using: usingTaskTypeIds.has(item.task_type_id!),
        })),
      optional_task_type: project.projectTaskTypes
        .filter((f) => !f.task_type_id)
        .map((item) => ({
          ...item,
          is_using: false,
        })),
    };

    return Response.json({ data: result, status: 200 });
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
    const data = body.data as IProject;

    const result = await prisma.project.update({
      where: { id: data.id },
      data: {
        code: data.code,
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date,
        value: data.value,
        people_cost: data.people_cost,
        people_cost_percent: data.people_cost_percent,
        description: data.description,
        status: data.status,
        updated_by: data.updated_by,
      },
    });

    // section member
    const existingMembers = await prisma.projectMember.findMany({
      where: { project_id: result.id },
    });

    const toKey = (m: { project_id: string; user_id: string }) => `${m.project_id}_${m.user_id}`;
    const payloadKeys = data.member.map(toKey);
    const dbKeys = existingMembers.map(toKey);

    const deleteMembers = existingMembers.filter((m) => !payloadKeys.includes(toKey(m)));
    if (deleteMembers.length) {
      await prisma.projectMember.deleteMany({
        where: {
          OR: deleteMembers.map((m) => ({
            project_id: m.project_id,
            user_id: m.user_id,
          })),
        },
      });
    }

    const updateMembers = data.member.filter((m) => dbKeys.includes(toKey(m)));

    const createMembers = data.member.filter((m) => !dbKeys.includes(toKey(m)));

    for (const member of updateMembers) {
      await prisma.projectMember.update({
        where: {
          project_id_user_id: {
            project_id: member.project_id,
            user_id: member.user_id,
          },
        },
        data: {
          user_id: member.user_id,
          role: member.role,
          day_price: member.day_price,
          start_date: member.start_date,
          end_date: member.end_date,
          work_hours: member.work_hours,
          hour_price: member.hour_price,
        },
      });
    }

    if (createMembers.length) {
      await prisma.projectMember.createMany({
        data: createMembers.map((item) => ({
          project_id: result.id,
          user_id: item.user_id,
          role: item.role,
          day_price: item.day_price,
          start_date: item.start_date,
          end_date: item.end_date,
          work_hours: item.work_hours,
          hour_price: item.hour_price,
        })),
      });
    }

    // section task
    const existingTask = await prisma.projectTaskType.findMany({
      where: { project_id: result.id },
    });

    const payloadTasks = [...data.main_task_type, ...data.optional_task_type].map((t) => ({
      ...t,
    }));

    const taskIds = payloadTasks.filter((t) => t.id).map((t) => t.id);

    const deleteTaskIds = existingTask
      .filter((dbTask) => !taskIds.includes(dbTask.id))
      .map((t) => t.id);

    if (deleteTaskIds.length) {
      await prisma.projectTaskType.deleteMany({
        where: { id: { in: deleteTaskIds } },
      });
    }

    const updateTasks = payloadTasks.filter((t) => t.id);
    const createTasks = payloadTasks.filter((t) => !t.id);

    for (const task of updateTasks) {
      await prisma.projectTaskType.update({
        where: { id: task.id },
        data: {
          type: task.type,
          task_type_id: task.task_type_id,
          name: task.name,
          description: task.description,
        },
      });
    }

    if (createTasks.length) {
      await prisma.projectTaskType.createMany({
        data: createTasks.map((task) => ({
          id: crypto.randomUUID(),
          type: task.type,
          project_id: result.id,
          task_type_id: task.task_type_id,
          name: task.name,
          description: task.description,
        })),
      });
    }

    return Response.json(
      {
        message: 'Update successfully',
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
      return Response.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const hasReference = await prisma.timeSheet.findFirst({
      where: { project_id: id },
    });

    if (hasReference) {
      return Response.json(
        {
          message: `Cannot delete this project while it is currently in use.`,
        },
        { status: 400 }
      );
    }

    const result = await prisma.project.update({
      where: { id },
      data: {
        is_enabled: false,
      },
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
