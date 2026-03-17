import z from 'zod';
import { TIMELINE_CARD_TONES } from '@/lib/constants/timesheet';

const taskTypeSchema = z.object({
  name: z.string().nonempty('กรุณากรอกชื่อประเภทงาน'),
  description: z.string().optional(),
  type: z.string().nonempty('กรุณาเลือกประเภทงาน'),
  tone_color: z.enum(TIMELINE_CARD_TONES, {
    error: 'กรุณาเลือกสี',
  }),
  is_active: z.boolean(),
});

type TaskTypeSchemaType = z.infer<typeof taskTypeSchema>;

export { taskTypeSchema, type TaskTypeSchemaType };
