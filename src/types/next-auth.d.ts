// types/next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    refreshToken?: string;
    resetPasswordDate?: Date | null;
    lastLoginAt?: Date | null;
  }
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
