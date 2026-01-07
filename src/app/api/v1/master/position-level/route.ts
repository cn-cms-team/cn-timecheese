import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const result = await prisma.position.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        name: true,
        positionLevels: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    // const result = await prisma.positionLevel.findMany({
    //   where: { is_enabled: true },
    //   select: {
    //     id: true,
    //     name: true,
    //     position: {
    //       select: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    //   orderBy: { name: 'asc' },
    // });
    const options = result.map((item) => ({
      label: `${item.name}`,
      id: item.id,
      options: item.positionLevels.map((pl) => ({
        label: `${pl.name}`,
        value: String(pl.id),
      })),
    }));

    return Response.json({ data: options, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
