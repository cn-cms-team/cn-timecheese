import z from 'zod';

const memberDetailSchema = z.object({
  id: z.string().uuid().optional(),
  // team_id: z.string().uuid().optional(),
  user_id: z.string(),
  role: z.string().nonempty('กรุณากรอกตำแหน่ง'),
  day_price: z.number().optional(),
  start_date: z.date('กรุณากรอกวันที่เริ่มต้น').optional(),
  end_date: z.date('กรุณากรอกวันที่สิ้นสุด').optional(),
  work_day: z.number().optional(),
  work_hours: z.number().optional(),
  hour_price: z.number().optional(),
  estimated_cost: z.number().optional(),
  is_using: z.boolean(),
});

const taskTypeSchema = z.object({
  id: z.string().optional(),
  task_type_id: z.string().nullable(),
  type: z.string(),
  name: z.string(),
  description: z.string(),
});

const baseSchema = {
  code: z.string().nonempty('กรุณากรอกรหัสโครงการ'),
  name: z.string().nonempty('กรุณากรอกชื่อโครงการ'),
  start_date: z.date('กรุณากรอกวันที่เริ่มต้น'),
  end_date: z.date('กรุณากรอกวันที่สิ้นสุด'),
  status: z.string().nonempty('กรุณากรอกสถานะโครงการ'),
  description: z.string().nullable().optional(),
  value: z.number('กรุณากรอกมูลค่าโครงการ'),
  people_cost: z.number().nullable().optional(),
  people_cost_percent: z.number().nullable().optional(),
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

type EditProjectSchema = z.infer<typeof editProjectSchema>;

type ProjectMemberSchema = z.infer<typeof memberDetailSchema>;

export {
  createProjectSchema,
  editProjectSchema,
  type CreateProjectSchema as CreateProjectSchemaType,
  type EditProjectSchema as EditProjectSchemaType,
  type ProjectMemberSchema as ProjectMemberSchemaType,
};
