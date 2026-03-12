import { getPascalCase } from '@/lib/functions/string-format';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await prisma.project.findMany({
      where: {
        is_enabled: true,
        OR: session.user?.id
          ? [
              { projectMembers: { some: { user_id: session.user.id } } },
              { is_company_project: true },
            ]
          : [{ is_company_project: true }],
      },

      select: {
        id: true,
        name: true,
        is_company_project: true,
        projectTaskTypes: {
          select: {
            id: true,
            type: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const options = result.map((item) => ({
      label: item.name,
      value: String(item.id),
      isCompanyProject: item.is_company_project,
      taskTypes: Object.entries(
        Object.groupBy(item.projectTaskTypes, (taskType) => taskType.type)
      ).map(([type, tasks]) => ({
        label: getPascalCase(type),
        options: tasks.map((task) => ({
          value: String(task.id),
          label: task.name,
          description: task.description,
        })),
      })),
    }));

    const optionGroup = [
      {
        label: 'Internal',
        options: options
          .filter((option) => option.isCompanyProject)
          .map((option) => ({
            label: option.label,
            value: option.value,
            taskTypes: option.taskTypes,
          })),
      },
      {
        label: 'Projects',
        options: options
          .filter((option) => !option.isCompanyProject)
          .map((option) => ({
            label: option.label,
            value: option.value,
            taskTypes: option.taskTypes,
          })),
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
