import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return Response.json({ error: 'Team ID is required' }, { status: 400 });
  }
  try {
    const team = await prisma.team.findUnique({
      where: { id, is_enabled: true },
      select: {
        id: true,
        name: true,
        description: true,
        is_active: true,
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        teamLeaders: {
          where: { team_id: id },
          select: {
            id: true,
            user_id: true,
            team_id: true,
          },
        },
      },
    });
    const userData = {
      ...team,
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
    const body = await request.json();
    const result = await prisma.team.update({
      where: { id: body.data.id },
      data: {
        ...body.data,
        updated_at: new Date(),
      },
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
      return Response.json({ error: 'team ID is required' }, { status: 400 });
    }
    const result = await prisma.team.delete({
      where: { id },
    });
    await prisma.teamLeader.deleteMany({
      where: { team_id: id },
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
