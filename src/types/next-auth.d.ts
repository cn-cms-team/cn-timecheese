import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    // refreshToken?: string;
    resetPasswordDate?: Date | null;
    lastLoginAt?: Date | null;
    team_id?: string;
  }
  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
