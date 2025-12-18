import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await auth();
  if (session) redirect('/');

  return <main className="h-screen bg-[#D9D9D9]">{children}</main>;
};

export default AuthLayout;
