import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { User } from '../generated/prisma/client';

export const UPDATE_AGE = parseInt(process.env.JWT_UPDATE_AGE_IN_SECONDS || '3600'); // default 1 hour
export const MAX_AGE = parseInt(process.env.JWT_MAX_AGE_IN_SECONDS || '86400'); // default 24 hours

const getUser = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        is_enabled: true,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        last_login_at: true,
        reset_password_date: true,
        password: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.email().nonempty(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);

        if (!user) return null;

        let userDetail = {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          resetPasswordDate: user.reset_password_date || null,
          lastLoginAt: user.last_login_at || null,
        };

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (user && passwordsMatch) {
          try {
            const lastLogin = new Date();
            userDetail.lastLoginAt = lastLogin;
            await prisma.user.update({
              where: { id: user.id },
              data: { last_login_at: lastLogin },
            });
          } catch (error) {
            console.error('Error updating last login:', error);
          }
        }

        return userDetail;
      },
    }),
  ],

  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
    updateAge: UPDATE_AGE,
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = (user.id as string) || token.id;
        token.name = user.name;
        token.email = user.email;
        token.resetPasswordDate = user.resetPasswordDate || token.resetPasswordDate;
        token.lastLoginAt = user.lastLoginAt || token.lastLoginAt;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.resetPasswordDate = token.resetPasswordDate as Date | null;
      session.user.lastLoginAt = token.lastLoginAt as Date | null;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});
