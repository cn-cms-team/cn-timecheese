'use server';

import { auth } from '@/auth';
import { ExecuteAction } from '@/lib/execute-actions';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const holidayPayloadSchema = z.object({
  name: z.string().trim().min(1, 'Holiday name is required').max(100),
  description: z.string().trim().max(255).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
});

type HolidayPayload = z.infer<typeof holidayPayloadSchema>;

const ensureAuthorized = async () => {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
};

const toDateOnlyUtc = (dateOnly: string) => {
  return new Date(`${dateOnly}T00:00:00.000Z`);
};

export async function createHoliday(formData: HolidayPayload) {
  await ensureAuthorized();

  return ExecuteAction({
    actionFn: async () => {
      const validated = holidayPayloadSchema.parse(formData);
      const normalizedDate = toDateOnlyUtc(validated.date);

      const existing = await prisma.holiday.findFirst({
        where: {
          date: normalizedDate,
          is_enabled: true,
        },
        select: { id: true },
      });

      if (existing) {
        return {
          success: false,
          code: 'DUPLICATE_DATE',
          message: 'There is already a holiday on the selected date',
        };
      }

      const result = await prisma.holiday.create({
        data: {
          name: validated.name,
          description: validated.description?.trim() || null,
          date: normalizedDate,
          is_enabled: true,
        },
      });

      revalidatePath('/setting/holidays');
      return { id: result.id };
    },
    successMessage: 'Created successfully',
  });
}

export async function updateHoliday(id: string, formData: HolidayPayload) {
  await ensureAuthorized();

  return ExecuteAction({
    actionFn: async () => {
      if (!id) {
        throw new Error('Holiday ID is required');
      }

      const validated = holidayPayloadSchema.parse(formData);
      const normalizedDate = toDateOnlyUtc(validated.date);

      const existing = await prisma.holiday.findFirst({
        where: {
          date: normalizedDate,
          is_enabled: true,
          id: {
            not: id,
          },
        },
        select: { id: true },
      });

      if (existing) {
        return {
          success: false,
          code: 'DUPLICATE_DATE',
          message: 'There is already a holiday on the selected date',
        };
      }

      const result = await prisma.holiday.update({
        where: { id },
        data: {
          name: validated.name,
          description: validated.description?.trim() || null,
          date: normalizedDate,
        },
      });

      revalidatePath('/setting/holidays');
      return { id: result.id };
    },
    successMessage: 'Updated successfully',
  });
}

export async function deleteHoliday(id: string) {
  await ensureAuthorized();

  return ExecuteAction({
    actionFn: async () => {
      if (!id) {
        throw new Error('Holiday ID is required');
      }

      const result = await prisma.holiday.update({
        where: { id },
        data: {
          is_enabled: false,
        },
      });

      revalidatePath('/setting/holidays');
      return { id: result.id };
    },
    successMessage: 'Deleted successfully',
  });
}
