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
            position_level: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teamLeaders: {
          where: { team_id: id },
          select: {
            id: true,
            user_id: true,
          },
        },
      },
    });

    if (team) {
      const leaderIds = (team.teamLeaders ?? []).map((tl) => tl.user_id).filter(Boolean);
      console.log(team.users);
      const usersUi = (team.users ?? []).map((u) => ({
        id: u.id,
        name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
        isManager: leaderIds.includes(u.id),
        position_level: u.position_level,
      }));

      usersUi.sort((a, b) => (b.isManager === true ? 1 : 0) - (a.isManager === true ? 1 : 0));

      const payload = {
        id: team.id,
        name: team.name,
        description: team.description,
        isActive: team.is_active,
        users: usersUi,
        teamLeaders: team.teamLeaders,
      };

      return Response.json({ data: payload, status: 200 });
    }
    return Response.json({ data: null, status: 200 });
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
      where: { id: body.id },
      data: body,
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
    const existingCount = await prisma.teamLeader.count({ where: { team_id: id } });
    let leaderDeletedCount = 0;
    if (existingCount > 0) {
      const leader = await prisma.teamLeader.deleteMany({ where: { team_id: id } });
      leaderDeletedCount = leader.count;
    }

    const result = await prisma.team.update({
      where: { id },
      data: {
        is_enabled: false,
        updated_at: new Date(),
      },
    });

    return Response.json(
      {
        message: `Delete successfully `,
        data: { id: result.id },
        leaderDeletedCount,
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
