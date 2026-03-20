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
        is_company_project: true,
        start_date: true,
        end_date: true,
        maintenance_start_date: true,
        maintenance_end_date: true,
        _count: {
          select: {
            projectMembers: true,
          },
        },
      },
    });

    const result = project.map((item) => ({
      ...item,
      members_count: item._count.projectMembers,
      is_using: false,
    }));

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { data } = (await request.json()) as {
      data: IProject & { member?: ProjectMemberSchemaType[] };
    };

    const { member = [], main_task_type = [], optional_task_type = [], ...projectData } = data;

    await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: projectData.name,
          code: projectData.code,
          pre_sale_code: projectData.pre_sale_code,
          description: projectData.description,
          value: projectData.value,
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          maintenance_start_date: projectData.maintenance_start_date,
          maintenance_end_date: projectData.maintenance_end_date,
          status: projectData.status,
          is_company_project: projectData.is_company_project,
          created_at: new Date(),
          created_by: projectData.created_by,
        },
      });

      const members = member.map((item) => ({
        project_id: project.id,
        user_id: item.user_id,
        role: item.role,
        day_price: item.day_price,
        start_date: item.start_date,
        end_date: item.end_date,
        work_hours: item.work_hours,
        hour_price: item.hour_price,
      }));

      if (members.length) {
        await tx.projectMember.createMany({
          data: members,
        });
      }

      const tasks = [...main_task_type, ...optional_task_type].map((item) => ({
        ...item,
        project_id: project.id,
      }));

      if (tasks.length) {
        await tx.projectTaskType.createMany({
          data: tasks,
        });
      }
    });

    return Response.json(
      {
        message: 'Created successfully',
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
