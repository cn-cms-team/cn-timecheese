import z from 'zod';

const schema = z.object({
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

  stamp_date: z.date('กรุณาเลือกวันที่บันทึกเวลา'),
  start_date: z.date('กรุณาเลือกกรอกเริ่มต้น'),
  end_date: z.date('กรุณากรอกวันที่สิ้นสุด'),
  detail: z.string().nonempty('กรุณากรอกรายละเอียดการทำงาน'),
  remark: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export { schema as timesheetCreateEditSchema, type Schema as TimesheetCreateEditSchema };
