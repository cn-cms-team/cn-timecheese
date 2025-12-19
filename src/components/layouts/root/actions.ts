'use server';
import { signOut } from '@/auth';
import { headers } from 'next/headers';

export async function handleSignout(user_id: string, pathname: string) {
  await signOut({ redirect: true, redirectTo: pathname });
}
