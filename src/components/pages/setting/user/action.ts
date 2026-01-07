'use server';
import prisma from '@/lib/prisma';

export const isEmailUnique = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return !user;
};
