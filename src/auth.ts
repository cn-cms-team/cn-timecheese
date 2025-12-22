import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { User } from '../generated/prisma/client';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const UPDATE_AGE = parseInt(process.env.JWT_UPDATE_AGE_IN_SECONDS || '3600'); // default 1 hour
export const MAX_AGE = parseInt(process.env.JWT_MAX_AGE_IN_SECONDS || '86400'); // default 24 hours

const getUser = async (email: string): Promise<User> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        is_enabled: true,
      },
    });
    return user as User;
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

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');

        return null;
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
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
