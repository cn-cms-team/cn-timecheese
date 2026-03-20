import prisma from '@/lib/prisma';
import { IProject } from '@/types/setting/project';
import { NextRequest } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return Response.json({ message: 'Project ID is required' }, { status: 400 });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id, is_enabled: true },
      select: {
        id: true,
        code: true,
        pre_sale_code: true,
        name: true,
        start_date: true,
        end_date: true,
        maintenance_start_date: true,
        maintenance_end_date: true,
        description: true,
        value: true,
        people_cost: true,
        people_cost_percent: true,
        status: true,
        is_company_project: true,
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
            is_using: true,
          },
        },
        projectTaskTypes: {
          select: {
            id: true,
            name: true,
            type: true,
            task_type_id: true,
            description: true,
            is_using: true,
            task_type: {
              select: {
                id: true,
                description: true,
              },
            },
          },
        },
        projectReportMembers: {
          select: {
            user_id: true,
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return Response.json({ message: 'Project Not Found', status: 404 });
    }

    const result = {
      id: project.id,
      code: project.code,
      pre_sale_code: project.pre_sale_code,
      name: project.name,
      start_date: project.start_date,
      end_date: project.end_date,
      maintenance_start_date: project.maintenance_start_date,
      maintenance_end_date: project.maintenance_end_date,
      description: project.description,
      value: project.value,
      people_cost: project.people_cost,
      people_cost_percent: project.people_cost_percent,
      status: project.status,
      is_company_project: project.is_company_project,
      member: project.projectMembers.map(({ user, ...rest }) => ({
        ...rest,
        name: `${user.first_name} ${user.last_name}`,
      })),
      main_task_type: project.projectTaskTypes
        .filter((f) => f.task_type_id)
        .map((item) => ({
          ...item,
          description: item?.task_type?.description,
        })),
      optional_task_type: project.projectTaskTypes
        .filter((f) => !f.task_type_id)
        .map((item) => ({
          ...item,
        })),
      report_members: project.projectReportMembers.map(({ user, user_id }) => ({
        user_id,
        name: `${user.first_name} ${user.last_name}`.trim(),
      })),
    };

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
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
        pre_sale_code: data.pre_sale_code,
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date,
        maintenance_start_date: data.maintenance_start_date,
        maintenance_end_date: data.maintenance_end_date,
        description: data.description,
        status: data.status,
        updated_by: data.updated_by,
      },
    });

    // section member
    const existingMembers = await prisma.projectMember.findMany({
      where: { project_id: result.id },
      select: { user_id: true },
    });

    const existingUserIds = new Set(existingMembers.map((m) => m.user_id));
    const payloadMembers = data.member.map((m) => ({
      ...m,
      project_id: result.id,
    }));
    const payloadUserIds = new Set(payloadMembers.map((m) => m.user_id));

    const deleteUserIds = [...existingUserIds].filter((userId) => !payloadUserIds.has(userId));
    const updateMembers = payloadMembers.filter((m) => existingUserIds.has(m.user_id));
    const createMembers = payloadMembers.filter((m) => !existingUserIds.has(m.user_id));

    await prisma.$transaction(async (tx) => {
      if (deleteUserIds.length) {
        await tx.projectMember.deleteMany({
          where: {
            project_id: result.id,
            user_id: { in: deleteUserIds },
          },
        });
      }

      if (updateMembers.length) {
        await Promise.all(
          updateMembers.map((member) =>
            tx.projectMember.update({
              where: {
                project_id_user_id: {
                  project_id: result.id,
                  user_id: member.user_id,
                },
              },
              data: {
                role: member.role,
                day_price: member.day_price,
                start_date: member.start_date,
                end_date: member.end_date,
                work_hours: member.work_hours,
                hour_price: member.hour_price,
              },
            })
          )
        );
      }

      if (createMembers.length) {
        await tx.projectMember.createMany({
          data: createMembers.map((member) => ({
            project_id: result.id,
            user_id: member.user_id,
            role: member.role,
            day_price: member.day_price,
            start_date: member.start_date,
            end_date: member.end_date,
            work_hours: member.work_hours,
            hour_price: member.hour_price,
          })),
        });
      }
    });

    // section task
    const existingTasks = await prisma.projectTaskType.findMany({
      where: { project_id: result.id },
      select: { id: true },
    });

    const payloadTasks = [...data.main_task_type, ...data.optional_task_type];

    const payloadTaskIds = new Set(
      payloadTasks.map((t) => t.id).filter((id): id is string => Boolean(id))
    );

    const deleteTaskIds = existingTasks.map((t) => t.id).filter((id) => !payloadTaskIds.has(id));
    const updateTasks = payloadTasks.filter((t): t is typeof t & { id: string } => Boolean(t.id));
    const createTasks = payloadTasks.filter((t) => !t.id);

    await prisma.$transaction(async (tx) => {
      if (deleteTaskIds.length) {
        await tx.projectTaskType.deleteMany({
          where: { id: { in: deleteTaskIds } },
        });
      }

      if (updateTasks.length) {
        await Promise.all(
          updateTasks.map((task) =>
            tx.projectTaskType.update({
              where: { id: task.id },
              data: {
                type: task.type,
                task_type_id: task.task_type_id,
                name: task.name,
                description: task.description,
              },
            })
          )
        );
      }

      if (createTasks.length) {
        await tx.projectTaskType.createMany({
          data: createTasks.map((task) => ({
            project_id: result.id,
            type: task.type,
            task_type_id: task.task_type_id,
            name: task.name,
            description: task.description,
          })),
        });
      }
    });

    return Response.json(
      {
        message: 'Updated successfully',
        data: { id: result.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ message: 'Project ID is required' }, { status: 400 });
    }

    const isInAnyTimeSheet = await prisma.timeSheet.findFirst({
      where: { project_id: id },
      select: { id: true },
    });

    if (isInAnyTimeSheet) {
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
        message: `Deleted successfully`,
        data: { id: result.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
