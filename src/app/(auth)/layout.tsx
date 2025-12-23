import type { Metadata } from 'next';
import AuthLayout from '@/components/layouts/auth';

export const metadata: Metadata = {
  title: 'Time Cheese',
  description: 'Time Cheese',
};

export default function Auth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
