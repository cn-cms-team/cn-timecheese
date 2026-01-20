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
        is_used: level._count.users > 0,
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
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const comingLevels: IPositionLevelRequest[] = body.data.levels;

    const result = await prisma.$transaction(async (tx) => {
      const existingLevels = await tx.positionLevel.findMany({
        where: { position_id: id },
        select: { id: true },
      });

      const existingIds = new Set(existingLevels.map((l) => l.id));
      const comingIds = new Set(comingLevels.filter((l) => l.id).map((l) => l.id!));

      const toUpdate = comingLevels.filter((l) => l.id && existingIds.has(l.id));
      const toCreate = comingLevels.filter((l) => !l.id);
      const toDeleteIds = [...existingIds].filter((id) => !comingIds.has(id));

      await Promise.all([
        // Update existing levels
        ...toUpdate.map((level) =>
          tx.positionLevel.update({
            where: { id: level.id },
            data: {
              ord: level.ord,
              name: level.name,
              description: level.description || null,
            },
          })
        ),
        // Create new levels
        toCreate.length > 0
          ? tx.positionLevel.createMany({
              data: toCreate.map((level) => ({
                position_id: id,
                ord: level.ord,
                name: level.name,
                description: level.description || null,
              })),
            })
          : Promise.resolve(),
        // Delete removed levels in batch
        toDeleteIds.length > 0
          ? tx.positionLevel.deleteMany({
              where: { id: { in: toDeleteIds } },
            })
          : Promise.resolve(),
      ]);

      return tx.position.update({
        where: { id },
        data: {
          name: body.data.name,
          description: body.data.description || null,
        },
      });
    });

    return Response.json({ message: 'Update success', data: { id: result.id } });
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
        { message: 'ระดับตำแหน่งถูกใช้งานอยู่ ไม่สามารถลบได้' },
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
        message: `Delete success `,
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
