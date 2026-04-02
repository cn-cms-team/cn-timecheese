import { auth } from '@/auth';
import { DD_INTERNAL_LABEL, DD_PROJECT_LABEL } from '@/lib/constants/dropdown';
import prisma from '@/lib/prisma';
import { ProjectTone } from '@/types/project';

type Option = { label: string; value: string };
type OptionGroup = { label: string; options: Option[] };

const toOptions = <
  T extends { id: number | string; name: string; code: string | null; color?: string | null },
>(
  items: T[]
): Option[] =>
  items.map(({ id, name, code, color }) => ({
    label: name,
    value: String(id),
    code: code,
    color: color as ProjectTone,
  }));

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const [companyProjects, memberProjects] = await Promise.all([
      prisma.project.findMany({
        where: {
          is_enabled: true,
          is_company_project: true,
        },
        select: {
          id: true,
          code: true,
          name: true,
          color: true,
        },
        orderBy: { name: 'asc' },
      }),
      prisma.projectMember.findMany({
        where: {
          user_id: session.user.id,
          project: { is_enabled: true, is_company_project: false },
        },
        select: {
          project_id: true,
          project: {
            select: {
              code: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: { project: { name: 'asc' } },
      }),
    ]);

    const internalProject = toOptions(companyProjects);
    const customerProject = memberProjects.map((item) => ({
      label: item.project.name,
      value: String(item.project_id),
      code: item.project.code,
      color: item.project.color as ProjectTone,
    }));
    const optionGroup: OptionGroup[] = [
      internalProject.length > 0 && {
        label: DD_INTERNAL_LABEL,
        options: internalProject,
      },
      customerProject.length > 0
        ? {
            label: DD_PROJECT_LABEL,
            options: customerProject,
          }
        : null,
    ].filter(Boolean) as OptionGroup[];

    return Response.json({ data: optionGroup }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
