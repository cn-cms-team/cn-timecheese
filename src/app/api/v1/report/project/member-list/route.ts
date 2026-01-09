import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  try {
    if (!projectId) {
      return Response.json({ error: 'Project ID is required' }, { status: 400 });
    }
    const project = await prisma.projectMember.findMany({
      where: { project_id: projectId },
      select: {
        user_id: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { user: { first_name: 'asc' } },
    });
    const options = project.map((item) => ({
      label: `${item.user.first_name} ${item.user.last_name}`,
      value: String(item.user_id),
    }));
    return Response.json({ data: options, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
