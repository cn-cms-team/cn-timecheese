import z from 'zod';

const permissionSchema = z.object({
  code: z.string(),
  checked: z.array(z.string()),
});

const createEditRoleSchema = z.object({
  name: z.string().nonempty('กรุณากรอกชื่อสิทธิ์การใช้งาน'),
  description: z.string().nonempty('กรุณากรอกคำอธิบายสิทธิ์การใช้งาน'),
  permissions: z
    .array(permissionSchema)
    .optional()
    .default([])
    .refine((permissions) => permissions.some((p) => p.checked.length > 0), {
      message: 'กรุณาเลือกอย่างน้อยหนึ่งสิทธิ์',
    }),
});

type CreateEditRoleSchema = z.infer<typeof createEditRoleSchema>;

export { createEditRoleSchema, type CreateEditRoleSchema };
