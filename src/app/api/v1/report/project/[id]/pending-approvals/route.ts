import { auth } from '@/auth';
import { toDateOnly, toUtcDayBoundary } from '@/lib/functions/date-format';
import prisma from '@/lib/prisma';
import {
  IApprovalPendingMember,
  IApprovalPendingResponse,
  IApprovalPendingSummary,
} from '@/types/report/approval';
import { TimelineCardTone } from '@/types/timesheet';

const toUtcDateOnly = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    if (!projectId) {
      return Response.json({ message: 'Project ID is required' }, { status: 400 });
    }

    const canAccessProject = await prisma.projectReportMember.findFirst({
      where: {
        project_id: projectId,
        user_id: session.user.id,
        project: {
          is_enabled: true,
        },
      },
      select: {
        project_id: true,
      },
    });

    if (!canAccessProject) {
      return Response.json({ message: 'Project not found or unauthorized' }, { status: 404 });
    }

    const summaries = await prisma.timeSheetSummary.findMany({
      where: {
        project_id: projectId,
        is_approved: false,
      },
      select: {
        user_id: true,
        project_id: true,
        sum_date: true,
        total_seconds: true,
        stamp_at: true,
        created_at: true,
      },
      orderBy: [{ sum_date: 'desc' }, { user_id: 'asc' }],
    });

    if (summaries.length === 0) {
      return Response.json(
        { data: { members: [], summaries: [] } as IApprovalPendingResponse },
        { status: 200 }
      );
    }

    const summaryDateKeys = summaries
      .map((summary) => toDateOnly(toUtcDateOnly(summary.sum_date)))
      .filter((dateOnly): dateOnly is string => Boolean(dateOnly));

    const userIds = [...new Set(summaries.map((summary) => summary.user_id))];
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        code: true,
        first_name: true,
        last_name: true,
        nick_name: true,
        position_level: {
          select: {
            name: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
    });

    const usersMap = new Map(users.map((user) => [user.id, user]));
    const sortedDateKeys = [...new Set(summaryDateKeys)].sort((a, b) => a.localeCompare(b));

    const minDate = sortedDateKeys[0];
    const maxDate = sortedDateKeys[sortedDateKeys.length - 1];

    const timeSheets =
      minDate && maxDate
        ? await prisma.timeSheet.findMany({
            where: {
              project_id: projectId,
              user_id: { in: userIds },
              is_approved: false,
              stamp_date: {
                gte: toUtcDayBoundary(minDate),
                lte: toUtcDayBoundary(maxDate, true),
              },
            },
            select: {
              id: true,
              user_id: true,
              stamp_date: true,
              start_date: true,
              end_date: true,
              exclude_seconds: true,
              total_seconds: true,
              detail: true,
              remark: true,
              is_work_from_home: true,
              project_task_type: {
                select: {
                  name: true,
                  task_type: {
                    select: {
                      tone_color: true,
                    },
                  },
                },
              },
            },
            orderBy: [{ stamp_date: 'desc' }, { start_date: 'asc' }],
          })
        : [];

    const timeSheetMap = new Map<string, typeof timeSheets>();

    for (const item of timeSheets) {
      const stampDate = toDateOnly(toUtcDateOnly(item.stamp_date));
      if (!stampDate) {
        continue;
      }

      const key = `${item.user_id}|${stampDate}`;
      const existing = timeSheetMap.get(key) ?? [];
      existing.push(item);
      timeSheetMap.set(key, existing);
    }

    const membersMap = new Map<string, IApprovalPendingMember>();
    const summaryData: IApprovalPendingSummary[] = summaries.map((summary) => {
      const dateOnly = toDateOnly(toUtcDateOnly(summary.sum_date)) || '';
      const key = `${summary.user_id}|${dateOnly}`;
      const summaryUser = usersMap.get(summary.user_id);
      const userInfo: IApprovalPendingMember = {
        user_id: summary.user_id,
        code: summaryUser?.code || '',
        first_name: summaryUser?.first_name || '-',
        last_name: summaryUser?.last_name || '',
        nick_name: summaryUser?.nick_name || '',
        position_name: summaryUser?.position_level?.name || '',
        team_name: summaryUser?.team?.name || '',
      };

      if (!membersMap.has(summary.user_id)) {
        membersMap.set(summary.user_id, userInfo);
      }

      const childTimeSheets = (timeSheetMap.get(key) ?? []).sort(
        (a, b) => a.start_date.getTime() - b.start_date.getTime()
      );

      return {
        user_id: summary.user_id,
        project_id: summary.project_id,
        sum_date: dateOnly,
        total_seconds: summary.total_seconds,
        stamp_at: summary.stamp_at.toISOString(),
        created_at: summary.created_at.toISOString(),
        user: userInfo,
        time_sheets: childTimeSheets.map((item) => ({
          id: item.id,
          stamp_date: toUtcDateOnly(item.stamp_date),
          start_date: item.start_date.toISOString(),
          end_date: item.end_date.toISOString(),
          exclude_seconds: item.exclude_seconds ?? 0,
          total_seconds: item.total_seconds,
          detail: item.detail || '',
          remark: item.remark || '',
          is_work_from_home: item.is_work_from_home,
          task_type_name: item.project_task_type?.name || '-',
          tone_color: (item.project_task_type?.task_type?.tone_color ||
            'slate') as TimelineCardTone,
        })),
      };
    });

    const summaryDataTimeSheetsNotEmpty = summaryData.filter((item) => item.time_sheets.length > 0);
    const userIdsUniqueWithTimeSheets = new Set(
      summaryDataTimeSheetsNotEmpty.map((item) => item.user_id)
    );

    return Response.json(
      {
        data: {
          members: Array.from(membersMap.values()).filter((member) =>
            userIdsUniqueWithTimeSheets.has(member.user_id)
          ),
          summaries: summaryDataTimeSheetsNotEmpty,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
