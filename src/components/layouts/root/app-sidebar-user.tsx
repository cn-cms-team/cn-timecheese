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
import { CircleUserRound, LogOut } from 'lucide-react';

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
            <div className="flex items-center gap-3 bg-gray-100/50 p-2 rounded-md hover:cursor-pointer hover:bg-gray-200 transition-colors">
              <CircleUserRound />
              <div className="grid flex-1 text-left text-sm leading-6">
                <span className="truncate font-semibold">พิชญากร ทรงบุญเขตกุล</span>
                <span className="truncate text-xs text-gray-400 py-0.5">Full-Stack Developer</span>
              </div>
            </div>
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
            className="flex items-center hover:bg-red-200 hover:text-red-500 font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <div className="text-center">ออกจากระบบ</div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
export default AppSidebarUser;
