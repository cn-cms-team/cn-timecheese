import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

import { swrConfig } from '@/lib/constants/swr-config';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppProvider, useLoading } from '@/components/context/app-context';
import { Toaster } from '@/components/ui/sonner';
import Loading from '@/components/ui/custom/loading/loading';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <AppProvider>
        <SWRConfig value={swrConfig}>
          <SidebarProvider>
            <AppSidebar />
            <Loading />
            <main className="w-full overflow-auto bg-stone-50">{children}</main>
            <Toaster />
          </SidebarProvider>
        </SWRConfig>
      </AppProvider>
    </SessionProvider>
  );
};

export default MainLayout;
