import z from 'zod';

const schema = z
  .object({
    id: z.string().optional(),
    project_id: z
      .string()
      .optional()
      .refine((val) => !!val && val !== 'none', {
        message: 'กรุณาเลือกโปรเจค',
      }),
    task_type_id: z
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
    detail: z.string().nonempty('กรุณากรอกรายละเอียดการทำงาน'),
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
          message: 'รวมเวลาทำงานทั้งหมดห้ามติดลบ',
          code: 'custom',
        });
      }
    }
  });

type Schema = z.infer<typeof schema>;

export { schema as timesheetCreateEditSchema, type Schema as TimesheetCreateEditSchema };
