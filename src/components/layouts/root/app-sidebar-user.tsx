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
import { useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const handleClickResetPassword = () => {
    setOpen(false);
    redirect(`/setting/user/${session?.user.id}/reset-password`);
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="mb-2" asChild>
            <SidebarMenuButton
              size={null}
              className="flex items-center bg-gray-100 hover:bg-gray-200 hover:text-black font-semibold hover:cursor-pointer focus-visible:ring-0"
            >
              <div className="px-2">
                <Avatar>
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_DICEBEAR_URL}${user.name.trim()}`}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left">
                <span className="truncate text-sm font-semibold leading-tight py-1">
                  {user.name}
                </span>
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
            className="flex items-center font-semibold hover:cursor-pointer"
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
