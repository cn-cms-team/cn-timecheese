'use client';
import { useState } from 'react';
import { redirect } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { CircleUserRound, LogOut, UserRound } from 'lucide-react';

const AppSidebarUser = () => {
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
              className="flex items-center bg-gray-100 hover:bg-gray-200 hover:text-black font-semibold"
            >
              <div className="px-2">
                <CircleUserRound width={20} height={20} />
              </div>
              <div className="grid flex-1 text-left text-sm">
                <span className="truncate font-semibold leading-tight">พิชญากร ทรงบุญเขตกุล</span>
                <span className="truncate text-xs text-gray-500 py-0.5">Full-Stack Developer</span>
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
            size="lg"
            className="flex items-center bg-red-200 hover:bg-red-200 hover:text-red-500 font-semibold"
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
