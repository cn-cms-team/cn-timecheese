import z from 'zod';

const memberDetailSchema = z.object({
  id: z.string().uuid().optional(),
  team_id: z.string().uuid(),
  user_id: z.string(),
  position: z.string().nonempty('กรุณากรอกตำแหน่ง'),
  day_price: z.number(),
  start_date: z.date('กรุณากรอกวันที่เริ่มต้น'),
  end_date: z.date('กรุณากรอกวันที่สิ้นสุด'),
});

const taskTypeSchema = z.object({
  id: z.string().uuid().optional(),
  task_type_id: z.string().uuid().optional(),
  type: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

const baseSchema = {
  code: z.string().nonempty('กรุณากรอกรหัสโครงการ'),
  name: z.string().nonempty('กรุณากรอกชื่อโครงการ'),
  start_date: z.date('กรุณากรอกวันที่เริ่มต้น'),
  end_date: z.date('กรุณากรอกวันที่สิ้นสุด'),
  status: z.string().nonempty('กรุณากรอกสถานะโครงการ'),
  description: z.string().nullable(),
  value: z.number(),
  member: z.array(memberDetailSchema),
  main_task_type: z.array(taskTypeSchema),
  optional_task_type: z.array(taskTypeSchema),
};
const createProjectSchema = z.object({
  ...baseSchema,
});

const editProjectSchema = z.object({
  ...baseSchema,
});

type CreateProjectSchema = z.infer<typeof createProjectSchema>;

type EditProjectSchema = z.infer<typeof createProjectSchema>;

export {
  createProjectSchema,
  editProjectSchema,
  type CreateProjectSchema as CreateProjectSchemaType,
  type EditProjectSchema as EditProjectSchemaType,
};
