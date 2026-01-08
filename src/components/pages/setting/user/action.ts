'use server';
import prisma from '@/lib/prisma';

export const isEmailUnique = async (email: string, id: string | null): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { email, ...(id && { AND: { id: { not: id } } }) },
  });
  return !user;
};
