import prisma from '@/lib/prisma';
import { ProjectMemberSchemaType } from '@/components/pages/setting/project/schema';
import { IProject } from '@/types/setting/project';

export async function GET() {
  try {
    const project = await prisma.project.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        name: true,
        code: true,
        start_date: true,
        end_date: true,
      },
    });

    const referenceProject = await prisma.timeSheet.findMany({
      select: {
        project_id: true,
      },
      distinct: 'project_id',
    });

    const usingProjectIds = new Set(referenceProject.map((r) => r.project_id));

    const result = project.map((item) => ({
      ...item,
      is_using: !!usingProjectIds.has(item.id),
    }));

    return Response.json({ data: result, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body.data as IProject;

    const project = await prisma.project.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        value: data.value,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        people_cost: data.people_cost,
        people_cost_percent: data.people_cost_percent,
        created_at: new Date(),
        created_by: data.created_by,
      },
    });

    const memberMap = body.data.member.map((item: ProjectMemberSchemaType) => ({
      project_id: project.id,
      user_id: item.user_id,
      role: item.role,
      day_price: item.day_price,
      start_date: item.start_date,
      end_date: item.end_date,
      work_hours: item.work_hours,
      hour_price: item.hour_price,
    }));

    await prisma.projectMember.createMany({
      data: memberMap,
    });

    const task = [...data.main_task_type, ...data.optional_task_type].map((item) => ({
      ...item,
      project_id: project.id,
    }));

    await prisma.projectTaskType.createMany({
      data: task,
    });

    return Response.json(
      {
        message: 'Create successfully',
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
