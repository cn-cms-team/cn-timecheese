import z from 'zod';

const schema = z.object({
  project_id: z.string().nonempty('กรุณาเลือกโปรเจค'),
  task_type_id: z.string().nonempty('กรุณาเลือกประเภทงาน'),
  stamp_date: z.date('กรุณาเลือกวันที่บันทึกเวลา'),
  start_date: z.date('กรุณาเลือกวันที่เริ่มต้น'),
  end_date: z.date('กรุณาเลือกวันที่สิ้นสุด'),
  detail: z.string().nonempty('กรุณากรอกรายละเอียดการทำงาน'),
  remark: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export { schema as timesheetCreateEditSchema, type Schema as TimesheetCreateEditSchema };
