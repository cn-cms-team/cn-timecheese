import prisma from '@/lib/prisma';

export async function getReportProjectByUser(projectId: string, memberId: string) {
  const result = await prisma.$transaction(async () => {
    const user = await prisma.user.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        code: true,
        start_date: true,
        position_level: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: 'Member not found' }, { status: 404 });
    }

    const project = await prisma.projectMember.findUnique({
      where: { project_id_user_id: { user_id: memberId, project_id: projectId } },
      select: {
        start_date: true,
        end_date: true,
        role: true,
        day_price: true,
        project: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });
    const projectCompany = await prisma.project.findUnique({
      where: {
        id: projectId,
        is_company_project: true,
      },
      select: {
        name: true,
        code: true,
        start_date: true,
        end_date: true,
      },
    });
    const timesheetSummary = await prisma.timeSheetSummary.findMany({
      where: {
        user_id: memberId,
        project_id: projectId,
      },
      select: {
        total_seconds: true,
      },
    });

    const timesheetGroup = await prisma.timeSheet.groupBy({
      where: {
        user_id: memberId,
        project_id: projectId,
      },
      by: ['project_task_type_id'],
      _sum: {
        total_seconds: true,
        exclude_seconds: true,
      },
    });

    const taskTypeIds = timesheetGroup
      .map((t) => t.project_task_type_id)
      .filter((id): id is string => id !== null);

    const taskTypes = await prisma.projectTaskType.findMany({
      where: {
        id: { in: taskTypeIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const taskTypeMap = new Map(taskTypes.map((tt) => [tt.id, tt.name]));

    const projectData = {
      project_id: projectId,
      user: {
        id: user?.id,
        position: user?.position_level?.name || '',
        code: user?.code,
        start_date: user?.start_date,
        full_name: `${user?.first_name} ${user?.last_name}`,
      },
      project: project
        ? {
            name: project?.project.name,
            code: project?.project.code,
            start_date: project?.start_date,
            end_date: project?.end_date,
            position: project?.role,
            day_price: project?.day_price,
            spent_times: timesheetSummary.reduce((acc, curr) => acc + (curr.total_seconds ?? 0), 0),
            exclude_seconds: timesheetGroup.reduce(
              (acc, curr) => acc + (curr._sum.exclude_seconds ?? 0),
              0
            ),
            last_tracked_at: null,
          }
        : projectCompany
          ? {
              name: projectCompany?.name,
              code: projectCompany?.code,
              start_date: projectCompany?.start_date,
              end_date: projectCompany?.end_date,
              position: '-',
              day_price: 0,
              spent_times: timesheetSummary.reduce(
                (acc, curr) => acc + (curr.total_seconds ?? 0),
                0
              ),
              exclude_seconds: timesheetGroup.reduce(
                (acc, curr) => acc + (curr._sum.exclude_seconds ?? 0),
                0
              ),
              last_tracked_at: null,
            }
          : null,
      timesheet_chart: timesheetGroup.map((ts) => ({
        task_type: taskTypeMap.get(ts.project_task_type_id!) || 'Unknown',
        tracked_hours: (ts._sum.total_seconds ?? 0) - (ts._sum.exclude_seconds ?? 0),
      })),
    };

    return projectData;
  });

  return result;
}
