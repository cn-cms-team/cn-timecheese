import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const project = await prisma.projectMember.findMany({
      where: { user_id: session.user?.id },
      select: {
        project_id: true,
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { project: { name: 'asc' } },
      distinct: ['project_id'],
    });
    const options = project.map((item) => ({
      label: item.project.name,
      value: String(item.project_id),
    }));
    return Response.json({ data: options, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
