import { auth } from '@/auth';
import { ProjectMemberSchemaType } from '@/components/pages/setting/project/schema';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const data = body.data;

    console.log('====================================');
    console.log(body.data.member);
    console.log('====================================');

    const projectId = `${crypto.randomUUID()}`;

    const project = await prisma.project.create({
      data: {
        id: projectId,
        name: data.name,
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
      project_id: projectId,
      user_id: item.user_id,
      role: item.role,
      day_price: item.day_price,
      start_date: item.start_date,
      end_date: item.end_date,
      work_hours: item.work_hours,
      hour_price: item.hour_price,
    }));

    const projectMember = await prisma.projectMember.createMany({
      data: memberMap,
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
