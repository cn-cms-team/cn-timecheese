import { auth } from '@/auth';
import { DD_INTERNAL_LABEL, DD_PROJECT_LABEL } from '@/lib/constants/dropdown';
import prisma from '@/lib/prisma';
import { ProjectTone } from '@/types/project';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const project = await prisma.projectReportMember.findMany({
      where: { user_id: session.user?.id, project: { is_enabled: true } },
      select: {
        project_id: true,
        project: {
          select: {
            code: true,
            name: true,
            is_company_project: true,
            color: true,
          },
        },
      },
      orderBy: { project: { name: 'asc' } },
      distinct: ['project_id'],
    });
    const projectOptions = project.map((item) => ({
      label: item.project.name,
      value: String(item.project_id),
      is_company_project: item.project.is_company_project,
      color: item.project.color as ProjectTone,
      code: item.project.code,
    }));
    const internalProject = projectOptions.filter((option) => option.is_company_project);
    const customerProject = projectOptions.filter((option) => !option.is_company_project);
    const optionGroup = [
      internalProject.length > 0 && {
        label: DD_INTERNAL_LABEL,
        options: internalProject,
      },
      customerProject.length > 0 && {
        label: DD_PROJECT_LABEL,
        options: customerProject,
      },
    ];
    return Response.json({ data: optionGroup }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
