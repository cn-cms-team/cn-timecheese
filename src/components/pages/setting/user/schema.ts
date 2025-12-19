import z from 'zod';

const baseSchema = {
  email: z.email('กรุณาตรวจสอบความถูกต้องของอีเมล').nonempty('กรุณากรอกอีเมล'),
  nick_name: z.string().min(2, 'ชื่อเล่นต้องมีความยาวอย่างน้อย 2 ตัวอักษร'),
  first_name: z.string().nonempty('กรุณากรอกชื่อของคุณ'),
  last_name: z.string().nonempty('กรุณากรอกนามสกุลของคุณ'),
  team_id: z.string().nonempty('กรุณาเลือกทีม'),
  position_id: z.string().optional(),
  position_level_id: z.string().nonempty('กรุณาเลือกระดับตำแหน่ง'),
  role_id: z.string().nonempty('กรุณาเลือกสิทธิ์การใช้งาน'),
  start_date: z.date('กรุณาเลือกวันที่เริ่มต้น'),
  end_date: z.date().nullable(),
  is_active: z.boolean().optional(),
};
const createUserSchema = z
  .object({
    ...baseSchema,
    password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
    confirm_password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['password', 'confirm_password'],
  });
const editUserSchema = z.object({
  ...baseSchema,
  password: z.string().optional(),
  confirm_password: z.string().optional(),
});
type CreateUserSchema = z.infer<typeof createUserSchema>;

type EditUserSchema = z.infer<typeof editUserSchema>;

export {
  createUserSchema,
  editUserSchema,
  type CreateUserSchema as CreateUserSchemaType,
  type EditUserSchema as EditUserSchemaType,
};
