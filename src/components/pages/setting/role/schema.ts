import z from 'zod';

const baseSchema = {
  name: z.string().nonempty('กรุณากรอกชื่อสิทธิ์การใช้งาน'),
  description: z.string().nonempty('กรุณากรอกคำอธิบาย'),
  permissions: z.array(z.string()).nonempty('กรุณาเลือกอย่างน้อยหนึ่งสิทธิ์การใช้งาน'),
};

const createRoleSchema = z.object({
  ...baseSchema,
});

type CreateRoleSchema = z.infer<typeof createRoleSchema>;

export { createRoleSchema, type CreateRoleSchema as CreateRoleSchemaType };
