'use server';

import { auth, signIn } from '@/auth';
import bcrypt from 'bcrypt';
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/components/pages/setting/user/schema';
import { SigninSchemaType } from '@/components/pages/sign-in/schema';
import { AuthError } from 'next-auth';
import { ExecuteAction } from './execute-actions';
import { AUTH_ERROR_CODES } from '@/types/constants/auth';
import prisma from './prisma';

export async function authenticate(prevState: string | undefined, formData: SigninSchemaType) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      const cause = error.cause?.err as Error;
      switch (cause.message) {
        case AUTH_ERROR_CODES.INVALID:
          return 'รหัสผ่านไม่ถูกต้อง กรุณากรอกข้อมูลใหม่อีกครั้ง';
        case AUTH_ERROR_CODES.NOTFOUND:
          return 'ไม่พบบัญชีของคุณภายในระบบ';
        default:
          return 'ไม่สามารถเชื่อมต่อได้ กรุณาติดต่อผู้ดูแลระบบ';
      }
    }
    throw error;
  }
}

export async function handleResetPasswordUser(id: string, formData: ResetPasswordSchemaType) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return ExecuteAction({
    actionFn: async () => {
      const validatedData = resetPasswordSchema.parse(formData);
      const password = await bcrypt.hash(validatedData.password as string, 10);
      const payload = {
        id: validatedData.id,
        password,
        updated_at: new Date(),
        updated_by: session.user.id as string,
        reset_password_date: new Date(),
      };
      const result = await prisma.user.update({
        where: { id: validatedData.id },
        data: { ...payload },
      });
      return result;
    },
    successMessage: 'รีเซ็ตรหัสผ่านผู้ใช้งานสำเร็จ',
  });
}
