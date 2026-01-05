import { ProjectStatus } from '@generated/prisma/enums';

export const getIsActive = (is_active: boolean): string => {
  return is_active ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน';
};

export const getProjectStatus = (status: ProjectStatus): string => {
  const value: Record<ProjectStatus, string> = {
    [ProjectStatus.CANCELLED]: 'ยกเลิก',
    [ProjectStatus.IN_PROGRESS]: 'อยู่ระหว่างดำเนินการ',
    [ProjectStatus.MAINTENANCE]: 'บำรุงรักษาระบบ',
    [ProjectStatus.ON_HOLD]: 'หยุดชั่วคราว',
    [ProjectStatus.PLANNING]: 'อยู่ระหว่างวางแผน',
    [ProjectStatus.PRE_SALE]: 'อยู่ระหว่างเสนอขาย',
    [ProjectStatus.TERMINATED]: 'สิ้นสุดโครงการ',
  };

  return value[status] ?? 'Unknown';
};
