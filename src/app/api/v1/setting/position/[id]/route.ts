import prisma from '@/lib/prisma';
import { IPositionLevelRequest } from '@/types/setting/position';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'Position ID is required' }, { status: 400 });
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
            _count: {
              select: {
                users: true,
              },
            },
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
      levels: position.positionLevels.map((level) => ({
        id: level.id,
        name: level.name,
        description: level.description,
        ord: level.ord,
        isUsed: level._count.users > 0,
      })),
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
    const body = await request.json();
    const comingLevels = body.data.levels;

    const result = await prisma.$transaction(async (tx) => {
      const existingLevels = await tx.positionLevel.findMany({
        where: { position_id: id },
        select: { id: true },
      });

      const comingIds = comingLevels
        .filter((l: IPositionLevelRequest) => l.id)
        .map((l: IPositionLevelRequest) => l.id);
      await Promise.all(
        comingLevels
          .filter((l: IPositionLevelRequest) => l.id)
          .map((level: IPositionLevelRequest) =>
            tx.positionLevel.update({
              where: { id: level.id },
              data: {
                ord: level.ord,
                name: level.name,
                description: level.description || null,
              },
            })
          )
      );

      await Promise.all(
        comingLevels
          .filter((l: IPositionLevelRequest) => !l.id)
          .map((level: IPositionLevelRequest) =>
            tx.positionLevel.create({
              data: {
                position_id: id,
                ord: level.ord,
                name: level.name,
                description: level.description || null,
              },
            })
          )
      );

      const removedLevelIds = existingLevels
        .map((l) => l.id)
        .filter((id) => !comingIds.includes(id));
      for (const levelId of removedLevelIds) {
        await tx.positionLevel.delete({
          where: { id: levelId },
        });
      }

      return tx.position.update({
        where: { id },
        data: {
          name: body.data.name,
          description: body.data.description || null,
        },
      });
    });

    return Response.json({ message: 'Update successfully', data: { id: result.id } });
  } catch (error) {
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
      return Response.json({ error: 'Position ID is required' }, { status: 400 });
    }

    const position = await prisma.position.findUnique({
      where: { id },
      select: {
        id: true,
        positionLevels: {
          select: {
            id: true,
            _count: {
              select: {
                users: true,
              },
            },
          },
        },
      },
    });

    const levelsIsUsed = position?.positionLevels.some((level) => level._count.users > 0);

    if (levelsIsUsed) {
      return Response.json(
        { error: 'Position Levels is used', code: 'POSITION_IN_USE' },
        { status: 400 }
      );
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
