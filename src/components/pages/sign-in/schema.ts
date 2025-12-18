import z from 'zod';

const formSchema = z.object({
  email: z.email('กรุณาตรวจสอบความถูกต้องของอีเมล').nonempty('กรุณากรอกอีเมล'),
  password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
});

type Schema = z.infer<typeof formSchema>;

export { formSchema as signinSchema, type Schema as SigninSchemaType };
