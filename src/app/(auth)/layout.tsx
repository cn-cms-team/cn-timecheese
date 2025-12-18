import type { Metadata } from 'next';
import AuthLayout from '@/components/layouts/auth';

export const metadata: Metadata = {
  title: 'CN Timesheet',
  description: 'CN Timesheet',
};

export default function Auth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
