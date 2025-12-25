import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { AppProvider } from '@/components/context/app-context';
import { Toaster } from '@/components/ui/sonner';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <AppProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full overflow-auto bg-stone-50">{children}</main>
          <Toaster />
        </SidebarProvider>
      </AppProvider>
    </SessionProvider>
  );
};

export default MainLayout;
