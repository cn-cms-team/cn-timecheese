import prisma from '@/lib/prisma';
import { ProjectMemberSchemaType } from '@/components/pages/setting/project/schema';

export async function GET() {
  try {
    const result = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        start_date: true,
        end_date: true,
      },
    });
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
    const data = body.data;

    const projectId = `${crypto.randomUUID()}`;

    await prisma.project.create({
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

    await prisma.projectMember.createMany({
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
