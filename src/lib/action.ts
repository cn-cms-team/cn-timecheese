'use server';

import { signIn } from '@/auth';
import { SigninSchemaType } from '@/components/pages/sign-in/schema';
import { AuthError } from 'next-auth';

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
