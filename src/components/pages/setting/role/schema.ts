import z from 'zod';

const permissionSchema = z.object({
  code: z.string(),
  checked: z.array(z.string()),
});

const schema = z.object({
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

// const createRoleSchema = z.object({
//   ...baseSchema,
// });

// const editRoleSchema = z.object({
//   ...baseSchema,
// });

type Schema = z.infer<typeof schema>;

export { schema as createEditRoleSchema, type Schema as CreateEditRoleSchemaType };
