import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { is_enabled: true, is_active: true },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        salary_range: true,
        position_level: {
          select: {
            name: true,
          },
        },
        team_id: true,
        role_id: true,
        code: true,
      },
      orderBy: { first_name: 'asc' },
    });
    const userMaps = users.map((user) => {
      return {
        ...user,
        name: [user.first_name, user.last_name].join(' ').trim(),
        position: user.position_level?.name,
      };
    });
    return Response.json({ data: userMaps, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
