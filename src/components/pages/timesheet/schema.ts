import z from 'zod';
import { hasUnsafeRichTextContent, sanitizePlainTextInput } from '@/lib/functions/input-security';

const schema = z
  .object({
    id: z.string().optional(),
    project_id: z
      .string()
      .optional()
      .refine((val) => !!val && val !== 'none', {
        message: 'กรุณาเลือกโครงการ',
      }),
    project_task_type_id: z
      .string()
      .optional()
      .refine((val) => !!val && val !== 'none', {
        message: 'กรุณาเลือกประเภทงาน',
      }),
    is_include_breaking_time: z.boolean().optional(),
    exclude: z.number().optional(),
    stamp_date: z.date('กรุณาเลือกวันที่บันทึกเวลา'),
    start_date: z.date('กรุณาเลือกกรอกเริ่มต้น'),
    end_date: z.date('กรุณากรอกวันที่สิ้นสุด'),
    detail: z
      .string()
      .transform((value) => sanitizePlainTextInput(value))
      .refine((value) => value.length > 0, {
        message: 'กรุณากรอกรายละเอียดการทำงาน',
      })
      .refine((value) => value.length <= 1000, {
        message: 'รายละเอียดการทำงานต้องไม่เกิน 1000 ตัวอักษร',
      })
      .refine((value) => !hasUnsafeRichTextContent(value), {
        message: 'ไม่อนุญาตให้กรอก HTML หรือ Script ที่อาจไม่ปลอดภัย',
      }),
    remark: z
      .string()
      .transform((value) => sanitizePlainTextInput(value))
      .refine((value) => value.length <= 255, {
        message: 'ปัญหาและข้อเสนอแนะต้องไม่เกิน 255 ตัวอักษร',
      })
      .refine((value) => !hasUnsafeRichTextContent(value), {
        message: 'ไม่อนุญาตให้กรอก HTML หรือ Script ที่อาจไม่ปลอดภัย',
      })
      .optional(),
    break_time: z.date().optional(),
    is_all_day: z.boolean().optional(),
    isWorkFromHome: z.boolean().optional(),
    stamp_date_string: z
      .string()
      .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
        message: 'Invalid date format, expected YYYY-MM-DD',
      })
      .optional(),
  })
  .superRefine(({ is_include_breaking_time, exclude }, ctx) => {
    if (is_include_breaking_time) {
      if (exclude === undefined || isNaN(exclude)) {
        ctx.addIssue({
          path: ['exclude'],
          message: 'กรุณาระบุเวลาพัก',
          code: 'custom',
        });
      }
    }
  })
  .superRefine((data, ctx) => {
    const { start_date, end_date } = data;

    if (start_date && end_date && start_date >= end_date) {
      ctx.addIssue({
        path: ['end_date'],
        message: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม',
        code: 'custom',
      });
    }
  })
  .superRefine((data, ctx) => {
    const { start_date, end_date } = data;

    if (start_date && end_date && end_date <= start_date) {
      ctx.addIssue({
        path: ['start_date'],
        message: 'เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด',
        code: 'custom',
      });
    }
  })
  .superRefine((data, ctx) => {
    const { start_date, end_date, exclude = 0, is_include_breaking_time } = data;

    if (!start_date || !end_date) return;

    const start = new Date(start_date);
    const end = new Date(end_date);

    end.setFullYear(start.getFullYear());
    end.setMonth(start.getMonth());
    end.setDate(start.getDate());

    const totalSeconds = (end.getTime() - start.getTime()) / 1000;

    if (is_include_breaking_time) {
      const finalSeconds = totalSeconds - exclude;

      if (finalSeconds <= 0) {
        ctx.addIssue({
          path: ['exclude'],
          message: 'เวลารวมกิจกรรมต้องมากกว่าหรือเท่ากับ 1 นาที',
          code: 'custom',
        });
      }
    }
  });

type Schema = z.infer<typeof schema>;

export { schema as timeSheetCreateEditSchema, type Schema as TimeSheetCreateEditSchema };
