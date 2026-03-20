import z from 'zod';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';

const holidaySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'กรุณากรอกชื่อวันหยุด')
    .max(MAX_LENGTH_100, `ชื่อต้องไม่เกิน ${MAX_LENGTH_100} ตัวอักษร`),
  description: z
    .string()
    .trim()
    .max(MAX_LENGTH_255, `คำอธิบายต้องไม่เกิน ${MAX_LENGTH_255} ตัวอักษร`)
    .optional(),
  date: z.date({ error: 'กรุณาเลือกวันที่' }),
});

type HolidaySchemaType = z.infer<typeof holidaySchema>;

export { holidaySchema, type HolidaySchemaType };
