import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        name: true,
        description: true,
        is_active: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return Response.json({ data: teams, status: 200 });
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
      data: body,
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
