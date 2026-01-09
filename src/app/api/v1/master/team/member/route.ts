import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const result = await prisma.user.findMany({
      where: { is_enabled: true, is_active: true, team_id: session.user.team_id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        // image: true,
      },
    });
    const options = result.map((item) => ({
      label: `${item.first_name} ${item.last_name}`,
      value: String(item.id),
      // image: item.image || undefined,
    }));

    return Response.json({ data: options, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
