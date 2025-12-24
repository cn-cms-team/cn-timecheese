import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const taskTypes = await prisma.taskType.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        is_active: true,
      },
      orderBy: { name: 'desc' },
    });
    return Response.json({ data: taskTypes, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
