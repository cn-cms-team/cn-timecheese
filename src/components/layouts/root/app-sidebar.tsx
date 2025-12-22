'use client';
import { useState } from 'react';

import {
  BriefcaseBusiness,
  CalendarDays,
  Home,
  Network,
  Presentation,
  ShieldUser,
  User,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import CheeseIcon from '@/components/ui/icons/cheese';
import AppSidebarUser from './app-sidebar-user';
import { AppSidebarNav } from './app-sidebar-nav';
import { useAccount } from '@/components/context/app-context';
import { useSession } from 'next-auth/react';

export function AppSidebar() {
  const { data: session } = useSession();
  const { account } = useAccount();
  const user = {
    id: session?.user?.id ?? '',
    username: session?.user?.name ?? '',
    avatar: session?.user?.image ?? undefined,
    permissions: account?.permissions ?? {},
    name: account.name ?? '',
    position_level: account.position_level ?? '',
  };
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <Sidebar className="noto-sans" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="relative">
            <div className="flex gap-2 items-center px-1 pt-1 overflow-hidden">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <CheeseIcon />
              </div>
              <div className="font-bold text-lg text-nowrap">Timecheese</div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarNav openSidebar={openSidebar} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={user} />
      </SidebarFooter>
      <SidebarRail onOpenChange={setOpenSidebar} />
    </Sidebar>
  );
}
