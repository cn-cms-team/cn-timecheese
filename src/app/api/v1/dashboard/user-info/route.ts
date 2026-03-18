import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        code: true,
        position_level: {
          select: {
            id: true,
            name: true,
          },
        },
        start_date: true,
        team_id: true,
      },
    });

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
