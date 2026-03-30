import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // check is team leader
    const teamLeader = await prisma.teamLeader.findFirst({
      where: { team_id: session.user.team_id, user_id: session.user.id },
    });
    const isTeamLeader = !!teamLeader;

    const result = await prisma.user.findMany({
      where: {
        is_enabled: true,
        is_active: true,
        ...(isTeamLeader ? { team_id: session.user.team_id } : { id: session.user.id }),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        nick_name: true,
      },
      orderBy: { first_name: 'asc' },
    });
    const options = result.map((item) => ({
      label: `${item.first_name} ${item.last_name} ${item.nick_name ? `(${item.nick_name})` : ''}`,
      value: String(item.id),
    }));

    return Response.json({ data: options }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
