import prisma from '@/lib/prisma';
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
      },
    });

    if (!project) {
      return Response.json({ error: 'ไม่พบข้อมูลโครงการ', status: 404 });
    }

    const result = {
      id: project.id,
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
    const result = await prisma.user.update({
      where: { id: body.data.id },
      data: { ...body.data },
    });

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
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await prisma.user.update({
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
