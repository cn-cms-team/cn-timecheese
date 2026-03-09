import type { Metadata } from 'next';

import MainLayout from '@/components/layouts/root';

export const metadata: Metadata = {
  title: 'Time Cheese',
  description: 'A time tracking app for Clicknext company.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
