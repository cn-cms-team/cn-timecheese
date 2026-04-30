import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user;
      const { href, pathname } = nextUrl;

      if (pathname.startsWith('/api/health')) {
        return true;
      }

      // Allow cron callback endpoint to run without browser session.
      if (pathname.startsWith('/api/v1/notifications/timesheet-reminder')) {
        return true;
      }

      if (!isLoggedIn) {
        if (pathname.startsWith('/sign-in')) {
          return true;
        } else {
          return Response.redirect(
            new URL(`/sign-in?callbackUrl=${encodeURIComponent(href)}`, nextUrl)
          );
        }
      } else {
        return !!auth;
      }
    },
  },
  providers: [],
};
