import z from 'zod';
import { MAX_LENGTH_100, MIN_LENGTH_6 } from '@/lib/constants/validation';

const PASSWORD_MIN_LENGTH = MIN_LENGTH_6;
const PASSWORD_MAX_LENGTH = MAX_LENGTH_100;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#?]).+$/;

const baseSchema = {
  email: z.email('กรุณาตรวจสอบความถูกต้องของอีเมล').nonempty('กรุณากรอกอีเมล'),
  nick_name: z.string().min(2, 'ชื่อเล่นต้องมีความยาวอย่างน้อย 2 ตัวอักษร'),
  first_name: z.string().nonempty('กรุณากรอกชื่อของคุณ'),
  last_name: z.string().nonempty('กรุณากรอกนามสกุลของคุณ'),
  code: z.string().nonempty('กรุณากรอกรหัสพนักงานของคุณ'),
  team_id: z.string().nonempty('กรุณาเลือกทีม'),
  position_level_id: z.string().nonempty('กรุณาเลือกระดับตำแหน่ง'),
  role_id: z.string().nonempty('กรุณาเลือกสิทธิ์การใช้งาน'),
  start_date: z.date('กรุณาเลือกวันที่เริ่มต้น'),
  end_date: z.date().nullable().optional(),
  is_active: z.boolean().optional(),
};
const createUserSchema = z
  .object({
    ...baseSchema,
    password: z
      .string('กรุณากรอกรหัสผ่าน')
      .min(PASSWORD_MIN_LENGTH, {
        message: `รหัสผ่านต้องมีความยาวอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`,
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: `รหัสผ่านต้องมีความยาวไม่เกิน ${PASSWORD_MAX_LENGTH} ตัวอักษร`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          'รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษตัวพิมพ์ใหญ่ (A-Z) ตัวพิมพ์เล็ก (a-z) ตัวเลข (0-9) และอักขระพิเศษ (@, $, !, ?, #)',
      }),
    confirm_password: z
      .string('กรุณากรอกยืนยันรหัสผ่าน')
      .min(PASSWORD_MIN_LENGTH, {
        message: `ยืนยันรหัสผ่านต้องมีความยาวอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`,
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: `ยืนยันรหัสผ่านต้องมีความยาวไม่เกิน ${PASSWORD_MAX_LENGTH} ตัวอักษร`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          'รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษตัวพิมพ์ใหญ่ (A-Z) ตัวพิมพ์เล็ก (a-z) ตัวเลข (0-9) และอักขระพิเศษ (@, $, !, ?, #)',
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'รหัสผ่าน และรหัสผ่านยืนยันไม่ตรงกัน กรุณาตรวจสอบและดำเนินการใหม่อีกครั้ง',
  });
const editUserSchema = z.object({
  ...baseSchema,
  password: z.string().optional(),
  confirm_password: z.string().optional(),
});
type CreateUserSchemaType = z.infer<typeof createUserSchema>;

type EditUserSchemaType = z.infer<typeof editUserSchema>;

const resetPasswordSchema = z
  .object({
    id: z.string().uuid(),
    password: z
      .string('กรุณากรอกรหัสผ่าน')
      .min(PASSWORD_MIN_LENGTH, {
        message: `รหัสผ่านต้องมีความยาวอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`,
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: `รหัสผ่านต้องมีความยาวไม่เกิน ${PASSWORD_MAX_LENGTH} ตัวอักษร`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          'รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษตัวพิมพ์ใหญ่ (A-Z) ตัวพิมพ์เล็ก (a-z) ตัวเลข (0-9) และอักขระพิเศษ (@, $, !, ?, #)',
      }),
    confirm_password: z
      .string('กรุณากรอกยืนยันรหัสผ่าน')
      .min(PASSWORD_MIN_LENGTH, {
        message: `ยืนยันรหัสผ่านต้องมีความยาวอย่างน้อย ${PASSWORD_MIN_LENGTH} ตัวอักษร`,
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: `ยืนยันรหัสผ่านต้องมีความยาวไม่เกิน ${PASSWORD_MAX_LENGTH} ตัวอักษร`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          'รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษตัวพิมพ์ใหญ่ (A-Z) ตัวพิมพ์เล็ก (a-z) ตัวเลข (0-9) และอักขระพิเศษ (@, $, !, ?, #)',
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'รหัสผ่าน และรหัสผ่านยืนยันไม่ตรงกัน กรุณาตรวจสอบและดำเนินการใหม่อีกครั้ง',
  });

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export {
  createUserSchema,
  editUserSchema,
  resetPasswordSchema,
  type CreateUserSchemaType,
  type EditUserSchemaType,
  type ResetPasswordSchemaType,
};
