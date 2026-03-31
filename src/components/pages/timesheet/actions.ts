'use server';
import { auth } from '@/auth';
import { timeSheetCreateEditSchema, TimeSheetCreateEditSchema } from './schema';
import { ExecuteAction } from '@/lib/execute-actions';
import prisma from '@/lib/prisma';
import { sanitizePlainTextInput } from '@/lib/functions/input-security';
import { Feeling } from '@generated/prisma/enums';

export async function handleAddTimeSheet(formData: TimeSheetCreateEditSchema) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return ExecuteAction({
    actionFn: async () => {
      const validatedData = timeSheetCreateEditSchema.parse(formData);
      const safeDetail = sanitizePlainTextInput(validatedData.detail || '');
      const safeRemark = sanitizePlainTextInput(validatedData.remark || '');
      const remarkValue = safeRemark.length > 0 ? safeRemark : null;

      if (!validatedData.project_id) throw new Error('Project ID is required');
      if (!validatedData.stamp_date_string) throw new Error('Stamp date is required');

      const stampDate = new Date(validatedData.stamp_date_string);
      const start = new Date(validatedData.start_date);
      const end = new Date(validatedData.end_date);

      if (start >= end) {
        throw new Error('Start time must be earlier than end time');
      }

      const overlappedTimeSheet = await prisma.timeSheet.findFirst({
        where: {
          user_id: session.user.id,
          stamp_date: stampDate,
          start_date: {
            lt: end,
          },
          end_date: {
            gt: start,
          },
        },
        select: {
          id: true,
        },
      });

      if (overlappedTimeSheet) {
        return {
          success: false,
          code: 'DUPLICATED_CODE',
          message: `This time range overlaps with an existing time sheet entry. Please adjust the start and end times.`,
        };
      }

      const totalSeconds =
        Math.floor((end.getTime() - start.getTime()) / 1000) - (validatedData.exclude ?? 0);
      const feeling = (validatedData.feeling ?? Feeling.NEUTRAL) as Feeling;
      const result = await prisma.timeSheet.create({
        data: {
          user_id: session.user.id,
          project_id: validatedData.project_id,
          project_task_type_id: validatedData.project_task_type_id,
          stamp_date: stampDate,
          start_date: start,
          end_date: end,
          detail: safeDetail,
          remark: remarkValue,
          feeling: feeling,
          exclude_seconds: validatedData.exclude ?? 0,
          is_work_from_home: validatedData.isWorkFromHome ?? false,
          total_seconds: totalSeconds,
        },
      });

      // Stamp is_using in ProjectMember and ProjectTaskType
      const project = await prisma.project.findUnique({
        where: { id: validatedData.project_id },
        select: { is_company_project: true },
      });
      if (!project?.is_company_project) {
        await prisma.projectMember.update({
          where: {
            project_id_user_id: {
              project_id: validatedData.project_id,
              user_id: session.user.id,
            },
          },
          data: { is_using: true },
        });
      }

      await prisma.projectTaskType.update({
        where: { id: validatedData.project_task_type_id },
        data: { is_using: true },
      });

      await prisma.timeSheetSummary.upsert({
        where: {
          user_id_project_id_sum_date: {
            user_id: session.user.id,
            project_id: validatedData.project_id,
            sum_date: stampDate,
          },
        },
        update: {
          total_seconds: {
            increment: totalSeconds,
          },
          stamp_at: new Date(),
        },
        create: {
          user_id: session.user.id,
          project_id: validatedData.project_id,
          sum_date: stampDate,
          total_seconds: totalSeconds,
          stamp_at: new Date(),
        },
      });

      // upsert FeelingProjectReport
      await prisma.feelingProjectReport.upsert({
        where: {
          user_id_project_id_feeling: {
            user_id: session.user.id,
            project_id: validatedData.project_id,
            feeling: feeling,
          },
        },
        update: {
          count: {
            increment: 1,
          },
        },
        create: {
          user_id: session.user.id,
          project_id: validatedData.project_id,
          feeling: feeling,
          count: 1,
        },
      });

      const hourData = await getHourData(session.user.id, stampDate);
      return { id: result.id, hourData };
    },
    successMessage: 'Created successfully',
  });
}

export async function handleEditTimeSheet(id: string, formData: TimeSheetCreateEditSchema) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return ExecuteAction({
    actionFn: async () => {
      const validatedData = timeSheetCreateEditSchema.parse(formData);
      const safeDetail = sanitizePlainTextInput(validatedData.detail || '');
      const safeRemark = sanitizePlainTextInput(validatedData.remark || '');
      const remarkValue = safeRemark.length > 0 ? safeRemark : null;

      if (!validatedData.project_id) throw new Error('Project ID is required');
      if (!validatedData.stamp_date_string) throw new Error('Stamp date is required');

      const ts = await prisma.timeSheet.findUnique({
        where: { id },
        select: {
          id: true,
          total_seconds: true,
          exclude_seconds: true,
          is_approved: true,
          feeling: true,
        },
      });

      if (!ts) {
        throw new Error('TimeSheet not found');
      }

      if (ts.is_approved) {
        return {
          success: false,
          message: 'รายการนี้อนุมัติแล้ว ไม่สามารถแก้ไขได้',
        };
      }

      const stampDate = new Date(validatedData.stamp_date_string);
      const start = new Date(validatedData.start_date);
      const end = new Date(validatedData.end_date);
      const totalSeconds =
        Math.floor((end.getTime() - start.getTime()) / 1000) - (validatedData.exclude ?? 0);

      if (start >= end) {
        throw new Error('Start time must be earlier than end time');
      }
      const feeling = (validatedData.feeling ?? Feeling.NEUTRAL) as Feeling;

      const overlappedTimeSheet = await prisma.timeSheet.findFirst({
        where: {
          user_id: session.user.id,
          id: { not: id },
          stamp_date: stampDate,
          start_date: {
            lt: end,
          },
          end_date: {
            gt: start,
          },
        },
        select: {
          id: true,
        },
      });

      if (overlappedTimeSheet) {
        return {
          success: false,
          code: 'DUPLICATED_CODE',
          message: `This time range overlaps with an existing time sheet entry.`,
        };
      }

      await prisma.timeSheet.update({
        where: {
          id: id,
        },
        data: {
          user_id: session.user.id,
          project_id: validatedData.project_id,
          project_task_type_id: validatedData.project_task_type_id,
          stamp_date: stampDate,
          start_date: start,
          end_date: end,
          detail: safeDetail,
          remark: remarkValue,
          feeling: feeling,
          exclude_seconds: validatedData.exclude ?? 0,
          is_work_from_home: validatedData.isWorkFromHome ?? false,
          total_seconds: totalSeconds,
        },
      });

      let isIncrement: boolean | null = null;
      const currentTotalSecond = totalSeconds;
      const oldTotalSecond = ts.total_seconds;

      switch (true) {
        case oldTotalSecond > currentTotalSecond:
          isIncrement = false;
          break;
        case oldTotalSecond < currentTotalSecond:
          isIncrement = true;
          break;
        default:
          isIncrement = null;
          break;
      }

      const diffSeconds = Math.abs(currentTotalSecond - oldTotalSecond);

      await prisma.timeSheetSummary.upsert({
        where: {
          user_id_project_id_sum_date: {
            user_id: session.user.id,
            project_id: validatedData.project_id,
            sum_date: stampDate,
          },
        },
        create: {
          user_id: session.user.id,
          project_id: validatedData.project_id,
          sum_date: stampDate,
          total_seconds: currentTotalSecond,
          stamp_at: new Date(),
        },
        update: {
          ...(diffSeconds !== 0 && {
            total_seconds: isIncrement ? { increment: diffSeconds } : { decrement: diffSeconds },
          }),
          stamp_at: new Date(),
        },
      });

      // if feeling is changed, upsert FeelingProjectReport
      if (ts.feeling !== feeling) {
        await prisma.feelingProjectReport.update({
          where: {
            user_id_project_id_feeling: {
              user_id: session.user.id,
              project_id: validatedData.project_id,
              feeling: ts.feeling,
            },
          },
          data: {
            count: {
              decrement: 1,
            },
          },
        });
        await prisma.feelingProjectReport.upsert({
          where: {
            user_id_project_id_feeling: {
              user_id: session.user.id,
              project_id: validatedData.project_id,
              feeling: feeling,
            },
          },
          update: {
            count: {
              increment: 1,
            },
          },
          create: {
            user_id: session.user.id,
            project_id: validatedData.project_id,
            feeling: feeling,
            count: 1,
          },
        });
      }

      const hourData = getHourData(session.user.id, stampDate);
      return { id: ts.id, hourData };
    },
    successMessage: 'Updated successfully',
  });
}

export async function handleDeleteTimeSheet(id: string) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return ExecuteAction({
    actionFn: async () => {
      const ts = await prisma.timeSheet.findUnique({
        where: { id },
        select: {
          id: true,
          project_id: true,
          stamp_date: true,
          total_seconds: true,
          exclude_seconds: true,
          is_approved: true,
          feeling: true,
        },
      });
      if (!ts) {
        throw new Error('TimeSheet not found');
      }

      if (ts.is_approved) {
        return {
          success: false,
          message: 'รายการนี้อนุมัติแล้ว ไม่สามารถลบได้',
        };
      }

      await prisma.timeSheet.delete({
        where: {
          id: id,
        },
      });

      await prisma.timeSheetSummary.update({
        where: {
          user_id_project_id_sum_date: {
            user_id: session.user.id,
            project_id: ts.project_id,
            sum_date: ts.stamp_date,
          },
        },
        data: {
          total_seconds: { decrement: ts.total_seconds },
          stamp_at: new Date(),
        },
      });

      await prisma.feelingProjectReport.update({
        where: {
          user_id_project_id_feeling: {
            user_id: session.user.id,
            project_id: ts.project_id,
            feeling: ts.feeling,
          },
        },
        data: {
          count: {
            decrement: 1,
          },
        },
      });

      const hourData = getHourData(session.user.id, ts.stamp_date);
      return { id: ts.id, hourData };
    },
    successMessage: 'Deleted successfully',
  });
}

async function getHourData(userId: string, stampDate: Date) {
  const tsSummary = await prisma.timeSheetSummary.findMany({
    where: {
      user_id: userId,
      sum_date: stampDate,
    },
    select: {
      sum_date: true,
      total_seconds: true,
    },
  });

  return tsSummary.reduce<Record<string, number>>((acc, item) => {
    const dateKey = item.sum_date.toISOString().split('T')[0];
    acc[dateKey] = (acc[dateKey] || 0) + item.total_seconds / 3600;
    return acc;
  }, {});
}
