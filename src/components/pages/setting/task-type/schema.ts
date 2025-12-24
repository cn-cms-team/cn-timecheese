import z from 'zod';

const taskTypeMemberSchema = z.array(
  z.object({
    name: z.string().nonempty('กรุณากรอกชื่อประเภทงาน'),
    description: z.string().optional(),
    type: z.string().nonempty(''),
    is_active: z.boolean().optional(),
  })
);

const taskTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string().nonempty(''),
  task_type: z.array(taskTypeMemberSchema),
});

type TaskTypeSchemaType = z.infer<typeof taskTypeSchema>;
type TaskTypeMemberSchemaType = z.infer<typeof taskTypeMemberSchema>;

export {
  taskTypeSchema,
  taskTypeMemberSchema,
  type TaskTypeSchemaType,
  type TaskTypeMemberSchemaType,
};
