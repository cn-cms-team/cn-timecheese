import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { IPositionLevelRequest } from '@/types/setting/position';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorize', status: 401 });
    }
    const body = await request.json();
    const result = await prisma.position.create({
      data: {
        name: body.data.name,
        description: body.data.description || null,
        is_enabled: true,
        created_by: session?.user?.id,
        positionLevels: {
          create: body.data.levels.map((level: IPositionLevelRequest) => ({
            ord: level.ord,
            name: level.name,
            description: level.description || null,
            is_enabled: true,
          })),
        },
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { created_at: 'asc' },
    });

    const positionMaps = positions.map((position) => {
      return {
        id: position.id,
        name: position.name,
        description: position.description || null,
      };
    });

    return Response.json({ data: positionMaps, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
