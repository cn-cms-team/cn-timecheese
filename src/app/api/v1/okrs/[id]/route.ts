import { auth } from '@/auth';
import { okrObjectiveSchema } from '@/components/pages/okrs/schema';
import { mapOkrObjectiveDetail } from '@/lib/okr';
import prisma from '@/lib/prisma';

const getObjectiveAccess = async (id: string, currentUserId: string, currentTeamId?: string) => {
  const objective = await prisma.okrObjective.findUnique({
    where: { id, is_enabled: true },
    select: {
      id: true,
      owner_id: true,
      owner: {
        select: {
          team_id: true,
        },
      },
    },
  });

  if (!objective) {
    return { status: 404 as const, message: 'Objective not found' };
  }

  if (objective.owner.team_id !== (currentTeamId ?? null)) {
    return { status: 403 as const, message: 'Objective not in your team' };
  }

  if (objective.owner_id !== currentUserId) {
    return { status: 403 as const, message: 'You do not have permission to modify this objective' };
  }

  return { status: 200 as const, objective };
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ message: 'Objective ID is required' }, { status: 400 });
    }

    const objective = await prisma.okrObjective.findFirst({
      where: {
        id,
        is_enabled: true,
        owner: {
          is_enabled: true,
          team_id: session.user.team_id ?? null,
        },
      },
      select: {
        id: true,
        title: true,
        created_at: true,
        updated_at: true,
        owner: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            nick_name: true,
            team_id: true,
          },
        },
        keyResults: {
          where: { is_enabled: true },
          orderBy: [{ start_date: 'asc' }, { created_at: 'asc' }],
          select: {
            id: true,
            title: true,
            start_date: true,
            end_date: true,
            target: true,
            progress: true,
            unit: true,
          },
        },
      },
    });

    if (!objective) {
      return Response.json({ message: 'Objective not found' }, { status: 404 });
    }

    return Response.json(
      { data: mapOkrObjectiveDetail(objective, session.user.id) },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ message: 'Objective ID is required' }, { status: 400 });
    }

    const access = await getObjectiveAccess(id, session.user.id, session.user.team_id);
    if (access.status !== 200) {
      return Response.json({ message: access.message }, { status: access.status });
    }

    const body = await request.json();
    const parsed = okrObjectiveSchema.safeParse(body.data ?? body);

    if (!parsed.success) {
      return Response.json(
        {
          message: parsed.error.issues[0]?.message ?? 'Invalid payload',
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.okrObjective.update({
        where: { id },
        data: {
          title: parsed.data.title,
          updated_at: new Date(),
        },
      });

      const existingKeyResults = await tx.okrKeyResult.findMany({
        where: {
          objective_id: id,
          is_enabled: true,
        },
        select: {
          id: true,
        },
      });

      const existingIds = new Set(existingKeyResults.map((item) => item.id));
      const payloadIds = new Set(
        parsed.data.keyResults
          .map((item) => item.id)
          .filter((item): item is string => Boolean(item))
      );

      const deleteIds = [...existingIds].filter((item) => !payloadIds.has(item));
      const updateKeyResults = parsed.data.keyResults.filter(
        (item): item is typeof item & { id: string } => {
          const itemId = item.id;
          return typeof itemId === 'string' && existingIds.has(itemId);
        }
      );
      const createKeyResults = parsed.data.keyResults.filter((item) => !item.id);

      if (deleteIds.length) {
        await tx.okrKeyResult.updateMany({
          where: {
            objective_id: id,
            id: { in: deleteIds },
          },
          data: {
            is_enabled: false,
            updated_at: new Date(),
          },
        });
      }

      if (updateKeyResults.length) {
        await Promise.all(
          updateKeyResults.map((item) =>
            tx.okrKeyResult.update({
              where: { id: item.id },
              data: {
                title: item.title,
                start_date: item.start_date,
                end_date: item.end_date,
                target: item.target,
                progress: item.progress,
                unit: item.unit?.trim() || null,
                updated_at: new Date(),
              },
            })
          )
        );
      }

      if (createKeyResults.length) {
        await tx.okrKeyResult.createMany({
          data: createKeyResults.map((item) => ({
            objective_id: id,
            title: item.title,
            start_date: item.start_date,
            end_date: item.end_date,
            target: item.target,
            progress: item.progress,
            unit: item.unit?.trim() || null,
          })),
        });
      }
    });

    return Response.json(
      {
        message: 'Updated successfully',
        data: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ message: 'Objective ID is required' }, { status: 400 });
    }

    const access = await getObjectiveAccess(id, session.user.id, session.user.team_id);
    if (access.status !== 200) {
      return Response.json({ message: access.message }, { status: access.status });
    }

    await prisma.$transaction(async (tx) => {
      await tx.okrObjective.update({
        where: { id },
        data: {
          is_enabled: false,
          updated_at: new Date(),
        },
      });

      await tx.okrKeyResult.updateMany({
        where: { objective_id: id, is_enabled: true },
        data: {
          is_enabled: false,
          updated_at: new Date(),
        },
      });
    });

    return Response.json(
      {
        message: 'Deleted successfully',
        data: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
