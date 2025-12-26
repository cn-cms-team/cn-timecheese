import prisma from '@/lib/prisma';
import { IOptionGroups } from '@/types/dropdown';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { is_enabled: true, is_active: true },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        team_id: true,
        position_level: {
          select: {
            name: true,
          },
        },
        team: {
          select: { name: true },
        },
      },
      orderBy: { first_name: 'asc' },
    });

    const options: IOptionGroups[] = Object.values(
      users.reduce<Record<string, IOptionGroups>>((acc, user) => {
        const teamKey = user.team_id ?? 'no_team';
        const teamLabel = user.team?.name ?? 'ไม่ระบุทีม';

        if (!acc[teamKey]) {
          acc[teamKey] = {
            label: teamLabel,
            options: [],
          };
        }

        acc[teamKey].options!.push({
          label: `${user.first_name} ${user.last_name}`.trim(),
          value: user.id,
          position: user.position_level?.name || null,
        });

        return acc;
      }, {})
    );
    return Response.json({ data: options, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
