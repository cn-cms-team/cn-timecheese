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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import CheeseIcon from '@/components/ui/icons/cheese';
import AppSidebarUser from './app-sidebar-user';

// Menu items.
const generalMenu = [
  {
    title: 'ภาพรวม',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Time Sheet',
    url: '/timesheet',
    icon: CalendarDays,
  },
];

const settingsMenu = [
  {
    title: 'ผู้ใช้งาน',
    url: '/setting/users',
    icon: User,
  },
  {
    title: 'โครงการ',
    url: '/setting/projects',
    icon: Presentation,
  },
  {
    title: 'ตำแหน่ง',
    url: '/setting/positions',
    icon: Network,
  },
  {
    title: 'ทีม',
    url: '/setting/teams',
    icon: Users,
  },
  {
    title: 'ประเภทงาน',
    url: '/setting/work-types',
    icon: BriefcaseBusiness,
  },
  {
    title: 'สิทธิ์การใช้งาน',
    url: '/setting/roles',
    icon: ShieldUser,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="noto-sans">
      <SidebarHeader>
        <div className="flex flex-nowrap gap-2 items-center px-2 pt-1">
          <div className="font-bold text-xl">CMS Timesheet</div>
          <CheeseIcon />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="text-md">
          <SidebarGroupLabel>ทั่วไป</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="text-md">
          <SidebarGroupLabel>ตั้งค่า</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
