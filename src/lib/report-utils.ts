import prisma from '@/lib/prisma';
import { IProjectInfoByUser } from '@/types/report';

export async function getReportUserInfo(memberId: string) {
  const user = await prisma.user.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      code: true,
      start_date: true,
      nick_name: true,
      position_level: {
        select: {
          name: true,
        },
      },
    },
  });
  return user;
}

export async function getReportProjectByUser(projectId: string, memberId: string) {
  // For chart task type
  const timeSheetGroup = await prisma.timeSheet.groupBy({
    where: {
      user_id: memberId,
      project_id: projectId,
    },
    by: ['project_task_type_id'],
    _sum: {
      total_seconds: true,
    },
  });

  const taskTypeIds = timeSheetGroup
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
  const projectInfo = await getProjectInfoWithMember(projectId, memberId);
  const result = {
    project_id: projectId,
    project: projectInfo,
    timeSheetChart: timeSheetGroup.map((ts) => ({
      task_type: ts.project_task_type_id
        ? (taskTypeMap.get(ts.project_task_type_id) ?? 'Unknown')
        : 'Unknown',
      tracked_hours: ts._sum.total_seconds,
    })),
  };

  return result;
}

async function getProjectInfoWithMember(
  projectId: string,
  memberId: string
): Promise<IProjectInfoByUser | null> {
  const currentProject = await prisma.project.findUnique({
    where: {
      id: projectId,
      is_enabled: true,
    },
    select: {
      is_company_project: true,
      maintenance_start_date: true,
      maintenance_end_date: true,
    },
  });
  if (!currentProject) {
    return null;
  }
  // For spent times
  const timeSheetSummary = await prisma.timeSheetSummary.groupBy({
    where: {
      user_id: memberId,
      project_id: projectId,
    },
    by: ['user_id', 'project_id'],
    _sum: {
      total_seconds: true,
    },
  });
  const timeSheetSummaryMAPeriod =
    currentProject.maintenance_start_date && currentProject.maintenance_end_date
      ? await prisma.timeSheetSummary.groupBy({
          where: {
            user_id: memberId,
            project_id: projectId,
            sum_date: {
              gte: currentProject.maintenance_start_date,
              lte: currentProject.maintenance_end_date,
            },
          },
          by: ['project_id'],
          _sum: {
            total_seconds: true,
          },
        })
      : [];
  const spentTimes = timeSheetSummary.length > 0 ? timeSheetSummary[0]._sum.total_seconds : 0;
  const spentTimesMAPeriod =
    timeSheetSummaryMAPeriod.length > 0 ? timeSheetSummaryMAPeriod[0]._sum.total_seconds : 0;

  if (currentProject.is_company_project) {
    const projectCompany = await prisma.project.findUnique({
      where: {
        id: projectId,
        is_company_project: true,
        is_enabled: true,
      },
      select: {
        name: true,
        code: true,
        start_date: true,
        end_date: true,
        maintenance_start_date: true,
        maintenance_end_date: true,
      },
    });
    if (!projectCompany) {
      return null;
    }
    return {
      id: projectId,
      name: projectCompany.name,
      code: projectCompany.code || '',
      start_date: projectCompany.start_date,
      end_date: projectCompany.end_date,
      maintenance_start_date: projectCompany.maintenance_start_date,
      maintenance_end_date: projectCompany.maintenance_end_date,
      position: '-',
      day_price: 0,
      spent_times: spentTimes || 0,
      spent_times_ma_period: spentTimesMAPeriod || 0,
      last_tracked_at: null,
    };
  } else {
    const project = await prisma.projectMember.findUnique({
      where: {
        project_id_user_id: { user_id: memberId, project_id: projectId },
        project: { is_enabled: true, is_company_project: false },
      },
      select: {
        start_date: true,
        end_date: true,
        role: true,
        day_price: true,
        project: {
          select: {
            name: true,
            code: true,
            start_date: true,
            end_date: true,
            maintenance_start_date: true,
            maintenance_end_date: true,
          },
        },
      },
    });
    if (!project) {
      return null;
    }
    return {
      id: projectId,
      name: project.project.name,
      code: project.project.code || '',
      start_date: project.start_date || project.project.start_date,
      end_date: project.end_date || project.project.end_date,
      maintenance_start_date: project.project.maintenance_start_date,
      maintenance_end_date: project.project.maintenance_end_date,
      position: project.role,
      day_price: project.day_price,
      spent_times: spentTimes || 0,
      spent_times_ma_period: spentTimesMAPeriod || 0,
      last_tracked_at: null,
    };
  }
}

export async function getProjectInfo(projectId: string): Promise<IProjectInfoByUser | null> {
  const projectCompany = await prisma.project.findUnique({
    where: {
      id: projectId,
      is_enabled: true,
    },
    select: {
      name: true,
      code: true,
      start_date: true,
      end_date: true,
      maintenance_start_date: true,
      maintenance_end_date: true,
    },
  });
  if (!projectCompany) {
    return null;
  }

  // For spent times
  const timeSheetSummary = await prisma.timeSheetSummary.groupBy({
    where: {
      project_id: projectId,
    },
    by: ['project_id'],
    _sum: {
      total_seconds: true,
    },
  });
  const timeSheetSummaryMAPeriod =
    projectCompany.maintenance_start_date && projectCompany.maintenance_end_date
      ? await prisma.timeSheetSummary.groupBy({
          where: {
            project_id: projectId,
            sum_date: {
              gte: projectCompany.maintenance_start_date,
              lte: projectCompany.maintenance_end_date,
            },
          },
          by: ['project_id'],
          _sum: {
            total_seconds: true,
          },
        })
      : [];
  const spentTimes = timeSheetSummary.length > 0 ? timeSheetSummary[0]._sum.total_seconds : 0;
  const spentTimesMAPeriod =
    timeSheetSummaryMAPeriod.length > 0 ? timeSheetSummaryMAPeriod[0]._sum.total_seconds : 0;

  return {
    id: projectId,
    name: projectCompany.name,
    code: projectCompany.code || '',
    start_date: projectCompany.start_date,
    end_date: projectCompany.end_date,
    maintenance_start_date: projectCompany.maintenance_start_date,
    maintenance_end_date: projectCompany.maintenance_end_date,
    position: '',
    day_price: 0,
    spent_times: spentTimes || 0,
    spent_times_ma_period: spentTimesMAPeriod || 0,
    last_tracked_at: null,
  };
}
