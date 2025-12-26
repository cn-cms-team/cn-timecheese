import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ message: 'project_id is required' }, { status: 400 });
    }

    const result = await prisma.projectTaskType.findMany({
      where: { project_id: id },
      select: {
        type: true,
        id: true,
        name: true,
      },
      orderBy: { type: 'asc' },
    });

    const options = Object.values(
      result.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = {
            label: item.type,
            options: [],
          };
        }

        acc[item.type].options.push({
          label: item?.name ?? '',
          value: item.id!,
        });

        return acc;
      }, {} as Record<string, { label: string; options: { label: string; value: string }[] }>)
    );

    return Response.json({ data: options }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
