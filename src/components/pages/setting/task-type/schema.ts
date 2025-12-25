import z from 'zod';

const taskTypeSchema = z.object({
  name: z.string().nonempty('กรุณากรอกชื่อประเภทงาน'),
  description: z.string().optional(),
  type: z.string().nonempty('กรุณาเลือกประเภทงาน'),
  is_active: z.boolean(),
});

type TaskTypeSchemaType = z.infer<typeof taskTypeSchema>;

export { taskTypeSchema, type TaskTypeSchemaType };
