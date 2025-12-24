import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const teamId = body.data?.team_id;
    const userId = body.data?.id;
    const isLeader = Boolean(body.data.status);
    if (!teamId || !userId) {
      return Response.json({ error: 'teamId and userId are required' }, { status: 400 });
    }
    if (isLeader) {
      const exists = await prisma.teamLeader.findFirst({
        where: { team_id: teamId, user_id: userId },
      });
      if (!exists) {
        const created = await prisma.teamLeader.create({
          data: { team_id: teamId, user_id: userId },
        });
        return Response.json({ message: 'Leader added', data: created }, { status: 200 });
      }
      return Response.json({ message: 'Leader already exists', data: exists }, { status: 200 });
    } else {
      const deleted = await prisma.teamLeader.deleteMany({
        where: { team_id: teamId, user_id: userId },
      });
      return Response.json({ message: 'Leader removed', data: deleted }, { status: 200 });
    }
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
