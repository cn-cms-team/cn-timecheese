import z from 'zod';

const formSchema = z.object({
  email: z.email('กรุณาตรวจสอบความถูกต้องของอีเมล').nonempty('กรุณากรอกอีเมล'),
  nickname: z.string().min(2, 'ชื่อเล่นต้องมีความยาวอย่างน้อย 2 ตัวอักษร'),
  password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
  confirm_password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
  first_name: z.string().min(2, 'ชื่อจริงต้องมีความยาวอย่างน้อย 2 ตัวอักษร'),
  last_name: z.string().min(2, 'นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร'),
  team_id: z.string().nonempty('กรุณาเลือกทีม'),
  position_id: z.string().nonempty('กรุณาเลือกตำแหน่ง'),
  position_level_id: z.string().nonempty('กรุณาเลือกระดับตำแหน่ง'),
  role_id: z.string().nonempty('กรุณาเลือกสิทธิ์การใช้งาน'),
  start_date: z.string().nonempty('กรุณาเลือกวันที่เริ่มต้น'),
  end_date: z.string().optional(),
  is_active: z.boolean().optional(),
});

type Schema = z.infer<typeof formSchema>;

export { formSchema as createUserSchema, type Schema as CreateUserSchemaType };
