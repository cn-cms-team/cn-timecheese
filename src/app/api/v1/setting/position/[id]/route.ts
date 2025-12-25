import prisma from '@/lib/prisma';
import { IPositionLevelRequest } from '@/types/setting/position';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const position = await prisma.position.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        positionLevels: {
          where: { is_enabled: true },
          select: {
            id: true,
            name: true,
            description: true,
            ord: true,
          },
          orderBy: { ord: 'asc' },
        },
      },
    });

    if (!position) {
      return Response.json({ error: 'Position not found' }, { status: 404 });
    }

    const formattedData = {
      id: position.id,
      name: position.name,
      description: position.description,
      levels: position.positionLevels,
    };

    return Response.json({ data: formattedData, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      await tx.positionLevel.deleteMany({
        where: { position_id: id },
      });
      return await tx.position.update({
        where: { id: id },
        data: {
          name: body.data.name,
          description: body.data.description || null,
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
    });

    return Response.json({ message: 'Update successfully', data: { id: result.id } });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.positionLevel.deleteMany({
        where: {
          position_id: id,
        },
      });
      return await tx.position.delete({
        where: { id: id },
      });
    });

    return Response.json(
      {
        message: `Delete successfully `,
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
