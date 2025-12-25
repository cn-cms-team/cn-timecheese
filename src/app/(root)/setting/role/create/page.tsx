import type { Metadata } from 'next';
import { RoleCreateView } from '@/components/pages/setting/role/view';

export const metadata: Metadata = {
  title: 'เพิ่มสิทธิ์การใช้งาน - CN Timesheet',
  description: 'CN Timesheet',
};

const RoleCreateSetting = async () => {
  return <RoleCreateView />;
};

export default RoleCreateSetting;
