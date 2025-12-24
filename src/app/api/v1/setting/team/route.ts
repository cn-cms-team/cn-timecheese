import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { created_at: 'desc' },
    });
    const userMaps = teams.map((team) => {
      return {
        ...team,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await prisma.team.create({
      data: { ...body.data },
    });

    return Response.json(
      {
        message: 'Create successfully',
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
