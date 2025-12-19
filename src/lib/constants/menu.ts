import { IMenu } from '@/types/menu';
import { CalendarDays, FileText, Home, Settings2 } from 'lucide-react';

export const menuItems: IMenu[] = [
  {
    menuId: 'DASHBOARD',
    name: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    menuId: 'TIME_SHEET',
    name: 'บันทึกเวลา',
    url: '/timesheet',
    icon: CalendarDays,
  },
  {
    name: 'รายงาน',
    url: '/report',
    icon: FileText,
    items: [
      {
        menuId: 'REPORT_PROJECT_STATUS',
        name: 'สถานะโครงการ',
        url: '/report/project',
      },
    ],
  },
  {
    name: 'ตั้งค่า',
    url: '/admin',
    icon: Settings2,
    items: [
      {
        menuId: 'ADMIN_USER',
        name: 'ผู้ใช้งาน',
        url: '/admin/user',
      },
      {
        menuId: 'ADMIN_ROLE',
        name: 'สิทธิ์การใช้งาน',
        url: '/admin/role',
      },
      {
        menuId: 'ADMIN_PROJECT',
        name: 'โครงการ',
        url: '/admin/project',
      },
      {
        menuId: 'ADMIN_TASK_TYPE',
        name: 'ประเภทงาน',
        url: '/admin/task-type',
      },
      {
        menuId: 'ADMIN_TEAM',
        name: 'ทีม',
        url: '/admin/team',
      },
      {
        menuId: 'ADMIN_POSITION',
        name: 'ตำแหน่งงาน',
        url: '/admin/position',
      },
    ],
  },
];
