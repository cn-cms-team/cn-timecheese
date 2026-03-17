import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const projectCompany = await prisma.project.findMany({
      where: {
        is_enabled: true,
        is_company_project: true,
      },
      select: {
        id: true,
        name: true,
      },
    });
    const companyOptions = projectCompany.map((item) => ({
      label: item.name,
      value: String(item.id),
    }));
    const project = await prisma.projectMember.findMany({
      where: { user_id: session.user?.id, project: { is_enabled: true } },
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
    const projectOptions = project.map((item) => ({
      label: item.project.name,
      value: String(item.project_id),
    }));
    const optionGroup = [
      {
        label: 'Internal',
        options: companyOptions,
      },
      {
        label: 'Projects',
        options: projectOptions,
      },
    ];
    return Response.json({ data: optionGroup, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
