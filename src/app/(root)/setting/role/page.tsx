import type { Metadata } from 'next';
import { RoleListView } from '@/components/pages/setting/role/view';

export const metadata: Metadata = {
  title: 'ตั้งค่าสิทธิ์การใช้งาน - Timecheese',
  description: 'Timecheese',
};

const RoleSetting = () => {
  return <RoleListView />;
};

export default RoleSetting;
