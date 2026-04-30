import { auth } from '@/auth';
import { okrObjectiveSchema } from '@/components/pages/okrs/schema';
import { mapOkrObjectiveListItem } from '@/lib/okr';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const objectives = await prisma.okrObjective.findMany({
      where: {
        is_enabled: true,
        owner: {
          is_enabled: true,
          team_id: session.user.team_id ?? null,
        },
      },
      orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }],
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

    return Response.json(
      { data: objectives.map((item) => mapOkrObjectiveListItem(item, session.user.id)) },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
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

    const objective = await prisma.$transaction(async (tx) => {
      const createdObjective = await tx.okrObjective.create({
        data: {
          title: parsed.data.title,
          owner_id: session.user.id,
        },
      });

      await tx.okrKeyResult.createMany({
        data: parsed.data.keyResults.map((item) => ({
          objective_id: createdObjective.id,
          title: item.title,
          start_date: item.start_date,
          end_date: item.end_date,
          target: item.target,
          progress: item.progress,
          unit: item.unit?.trim() || null,
        })),
      });

      return createdObjective;
    });

    return Response.json(
      {
        message: 'Created successfully',
        data: { id: objective.id },
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
