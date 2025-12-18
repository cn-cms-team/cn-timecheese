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

      if (!isLoggedIn) {
        if (pathname.startsWith('/sign-in')) {
          return true;
        } else {
          return Response.redirect(
            new URL(`/sign-in?callbackUrl=${encodeURIComponent(href)}`, nextUrl)
          );
        }
      } else if (isLoggedIn) {
        return isLoggedIn;
      } else {
        return true;
      }
    },
  },
  providers: [],
};
