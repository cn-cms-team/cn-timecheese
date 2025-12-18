import NextAuth from 'next-auth';

const { handlers } = NextAuth({
  providers: [],
  secret: process.env.AUTH_SECRET,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
