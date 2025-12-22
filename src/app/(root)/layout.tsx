import type { Metadata } from 'next';

import MainLayout from '@/components/layouts/root';

export const metadata: Metadata = {
  title: 'Timecheese',
  description: 'Timecheese',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
