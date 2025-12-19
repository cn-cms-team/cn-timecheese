'use client';
import { useState } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { handleSignout } from './actions';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { CircleUserRound, LogOut } from 'lucide-react';

export type AppSidebarUserProps = {
  user: {
    id: string;
    username: string;
    avatar?: string;
    name: string;
    permissions?: Record<string, string[]>;
    position_level: string;
  };
};

const AppSidebarUser = ({ user }: AppSidebarUserProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const handleClickResetPassword = () => {
    setOpen(false);
    redirect('/change-password');
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="mb-2" asChild>
            <SidebarMenuButton
              size="lg"
              className="flex items-center bg-gray-100 hover:bg-gray-200 hover:text-black font-semibold hover:cursor-pointer"
            >
              <div className="px-2">
                <CircleUserRound width={20} height={20} />
              </div>
              <div className="grid flex-1 text-left text-sm">
                <span className="truncate font-semibold leading-tight">{user.name}</span>
                <span className="truncate text-xs text-gray-500 py-0.5">{user.position_level}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right">
            <DropdownMenuItem
              className={`noto-sans px-3 py-2 text-sm cursor-pointer text-gray-700 focus:bg-[#eff4ff] focus:outline-none`}
              onClick={() => handleClickResetPassword()}
            >
              เปลี่ยนรหัสผ่าน
            </DropdownMenuItem>
          </DropdownMenuContent>
          <SidebarMenuButton
            className="flex items-center bg-red-200 hover:bg-red-200 hover:text-red-500 font-semibold hover:cursor-pointer"
            onClick={async () => handleSignout(user.id, pathname)}
          >
            <div className="px-2">
              <LogOut width={20} height={20} />
            </div>
            <div className="text-center">ออกจากระบบ</div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
export default AppSidebarUser;
