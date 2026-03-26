'use server';

import { auth } from '@/auth';
import { ExecuteAction } from '@/lib/execute-actions';
import { toDateOnly, toUtcDayBoundary } from '@/lib/functions/date-format';
import prisma from '@/lib/prisma';
import { IApprovalActionPayload } from '@/types/report/approval';

export async function handleApproveTimeSheetSummary(payload: IApprovalActionPayload) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error('Unauthorized');
  }

  return ExecuteAction({
    actionFn: async () => {
      if (!payload.user_id || !payload.project_id || !payload.sum_date) {
        throw new Error('Invalid approval payload');
      }

      const dateOnly = toDateOnly(payload.sum_date);
      if (!dateOnly) {
        throw new Error('Invalid sum date');
      }

      const dayStart = toUtcDayBoundary(dateOnly);
      const dayEnd = toUtcDayBoundary(dateOnly, true);

      const approver = session.user.id;
      const approvedAt = new Date();

      const [updatedSummary, updatedTimeSheets] = await prisma.$transaction([
        prisma.timeSheetSummary.updateMany({
          where: {
            user_id: payload.user_id,
            project_id: payload.project_id,
            sum_date: {
              gte: dayStart,
              lte: dayEnd,
            },
            is_approved: false,
          },
          data: {
            is_approved: true,
            approved_at: approvedAt,
            approved_by: approver,
          },
        }),
        prisma.timeSheet.updateMany({
          where: {
            user_id: payload.user_id,
            project_id: payload.project_id,
            stamp_date: {
              gte: dayStart,
              lte: dayEnd,
            },
            is_approved: false,
          },
          data: {
            is_approved: true,
          },
        }),
      ]);

      if (updatedSummary.count === 0) {
        throw new Error('TimeSheet summary not found or already approved');
      }

      return { updated_count: updatedTimeSheets.count };
    },
    successMessage: 'Approved successfully',
  });
}
