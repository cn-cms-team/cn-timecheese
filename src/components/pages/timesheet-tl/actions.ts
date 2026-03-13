'use server';
import { auth } from '@/auth';
import { timeSheetCreateEditSchema, TimeSheetCreateEditSchema } from './schema';
import { ExecuteAction } from '@/lib/execute-actions';
import prisma from '@/lib/prisma';

export async function handleAddTimeSheet(formData: TimeSheetCreateEditSchema) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return ExecuteAction({
    actionFn: async () => {
      const validatedData = timeSheetCreateEditSchema.parse(formData);

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

      const total_seconds = Math.floor((end.getTime() - start.getTime()) / 1000);

      const result = await prisma.timeSheet.create({
        data: {
          user_id: session.user.id,
          project_id: validatedData.project_id,
          project_task_type_id: validatedData.project_task_type_id,
          stamp_date: stampDate,
          start_date: start,
          end_date: end,
          detail: validatedData.detail || '',
          exclude_seconds: validatedData.exclude ?? 0,
          total_seconds,
        },
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
            increment: total_seconds,
          },
          stamp_at: new Date(),
        },
        create: {
          user_id: session.user.id,
          project_id: validatedData.project_id,
          sum_date: stampDate,
          total_seconds: validatedData.exclude
            ? total_seconds - validatedData.exclude
            : total_seconds,
          stamp_at: new Date(),
        },
      });

      const tsSummary = await prisma.timeSheetSummary.findMany({
        where: {
          user_id: session.user.id,
          sum_date: stampDate,
        },
        select: {
          sum_date: true,
          total_seconds: true,
        },
      });

      const hourData = tsSummary.reduce<Record<string, number>>((acc, item) => {
        const dateKey = item.sum_date.toISOString().split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + item.total_seconds / 3600;
        return acc;
      }, {});

      return { id: result.id, hourData };
    },
    successMessage: 'Added successfully',
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

      if (!validatedData.project_id) throw new Error('Project ID is required');
      if (!validatedData.stamp_date_string) throw new Error('Stamp date is required');

      const ts = await prisma.timeSheet.findUnique({
        where: { id },
        select: {
          id: true,
          total_seconds: true,
        },
      });

      if (!ts) {
        throw new Error('TimeSheet not found');
      }

      const stampDate = new Date(validatedData.stamp_date_string);
      const start = new Date(validatedData.start_date);
      const end = new Date(validatedData.end_date);
      const total_seconds = Math.floor((end.getTime() - start.getTime()) / 1000);

      if (start >= end) {
        throw new Error('Start time must be earlier than end time');
      }

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
          message: `This time range overlaps with an existing time sheet entry. Please adjust the start and end times.`,
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
          detail: validatedData.detail || '',
          exclude_seconds: validatedData.exclude ?? 0,
          total_seconds,
        },
      });

      let isIncrement: boolean | null = null;
      const currentTotalSecond = total_seconds;
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

      await prisma.timeSheetSummary.update({
        where: {
          user_id_project_id_sum_date: {
            user_id: session.user.id,
            project_id: validatedData.project_id,
            sum_date: stampDate,
          },
        },
        data: {
          ...(diffSeconds !== 0 && {
            total_seconds: isIncrement ? { increment: diffSeconds } : { decrement: diffSeconds },
          }),
          stamp_at: new Date(),
        },
      });

      const tsSummary = await prisma.timeSheetSummary.findMany({
        where: {
          user_id: session.user.id,
          sum_date: stampDate,
        },
        select: {
          sum_date: true,
          total_seconds: true,
        },
      });

      const hourData = tsSummary.reduce<Record<string, number>>((acc, item) => {
        const dateKey = item.sum_date.toISOString().split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + item.total_seconds / 3600;
        return acc;
      }, {});

      return { id: ts.id, hourData };
    },
    successMessage: 'Updated successfully',
  });
}
