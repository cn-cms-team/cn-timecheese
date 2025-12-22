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

export async function authenticate(prevState: string | undefined, formData: SigninSchemaType) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
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
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(validatedData.password as string, salt);
      const payload = {
        id,
        password,
        updated_at: new Date(),
        updated_by: session.user.id as string,
        reset_password_date: new Date(),
      };
      const fetchUrl = `/api/v1/setting/user/${id}`;
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      });
      if (response.ok) {
        const result = await response.json();
        return { id: result.id };
      } else {
        return { id: null };
      }
    },
    successMessage: 'รีเซ็ตรหัสผ่านผู้ใช้งานสำเร็จ',
  });
}
