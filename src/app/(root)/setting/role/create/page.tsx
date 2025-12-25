import type { Metadata } from 'next';
import { RoleCreateView } from '@/components/pages/setting/role/view';

export const metadata: Metadata = {
  title: 'เพิ่มสิทธิ์การใช้งาน - CN Timecheet',
  description: 'CN Timecheet',
};

const RoleCreateSetting = async () => {
  return <RoleCreateView />;
};

export default RoleCreateSetting;
