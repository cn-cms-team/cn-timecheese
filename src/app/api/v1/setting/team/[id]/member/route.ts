import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userId = body.data?.user_id;
    const isLeader = Boolean(body.data?.status);
    if (!id || !userId) {
      return Response.json({ error: 'teamId and userId  are required' }, { status: 400 });
    }
    if (isLeader) {
      const exists = await prisma.teamLeader.findFirst({
        where: { team_id: id, user_id: userId },
      });
      if (!exists) {
        const created = await prisma.teamLeader.create({
          data: { team_id: id, user_id: userId },
        });
        return Response.json({ message: 'Permission added', data: created }, { status: 200 });
      }
      return Response.json({ message: 'Permission already exists', data: exists }, { status: 200 });
    } else {
      const deleted = await prisma.teamLeader.deleteMany({
        where: { team_id: id, user_id: userId },
      });
      return Response.json({ message: 'Permission removed', data: deleted }, { status: 200 });
    }
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
