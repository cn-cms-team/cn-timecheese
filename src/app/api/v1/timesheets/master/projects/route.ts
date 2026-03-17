import { getPascalCase } from '@/lib/functions/string-format';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
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
        start_date: true,
        end_date: true,
        projectMembers: {
          select: {
            start_date: true,
            end_date: true,
          },
        },
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
      startDate: item.projectMembers[0]?.start_date || item.start_date,
      endDate: item.projectMembers[0]?.end_date || item.end_date,
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
            startDate: option.startDate,
            endDate: option.endDate,
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
            startDate: option.startDate,
            endDate: option.endDate,
          })),
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
