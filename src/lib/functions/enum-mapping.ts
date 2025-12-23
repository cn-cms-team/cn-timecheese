import { ProjectStatus } from '../../../generated/prisma/client';

export const getIsActive = (is_active: boolean): string => {
  return is_active ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน';
};

export const getProjectStatus = (status: ProjectStatus): string => {
  const value: Record<ProjectStatus, string> = {
    [ProjectStatus.CANCELLED]: 'ยกเลิก',
    [ProjectStatus.IN_PROGRESS]: 'กำลังพัฒนา',
    [ProjectStatus.MAINTENANCE]: 'บำรุงรักษาระบบ',
    [ProjectStatus.ON_HOLD]: 'หยุดชั่วคราว',
    [ProjectStatus.PLANNING]: 'กำลังวางแผน',
    [ProjectStatus.PRE_SALE]: 'กำลังนำเสนอขาย',
    [ProjectStatus.TERMINATED]: 'ยกเลิก',
  };

  return value[status] ?? 'Unknown';
};
