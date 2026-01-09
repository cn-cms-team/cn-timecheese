import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return Response.json({ error: 'User ID is required' }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id, is_enabled: true },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        nick_name: true,
        is_active: true,
        start_date: true,
        end_date: true,
        salary_range: true,
        code: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        position_level: {
          select: {
            id: true,
            name: true,
            position: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const userData = {
      ...user,
      position_id: user?.position_level ? user?.position_level.position?.id : '',
      team_id: user?.team?.id,
      role_id: user?.role?.id,
      position_level_id: user?.position_level?.id,
    };
    return Response.json({ data: userData, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return Response.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = await prisma.user.update({
      where: { id: body.data.id },
      data: { ...body.data, updated_by: session?.user.id },
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
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }
    const isInAnyProject = await prisma.project.findFirst({
      where: {
        projectMembers: {
          some: {
            user_id: id,
          },
        },
      },
    });

    if (isInAnyProject) {
      return Response.json({ message: 'User is in use in project' }, { status: 409 });
    }

    const result = await prisma.user.update({
      where: { id },
      data: {
        is_enabled: false,
      },
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
