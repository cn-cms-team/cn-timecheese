import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full overflow-auto">{children}</main>
      </SidebarProvider>
    </SessionProvider>
  );
}
