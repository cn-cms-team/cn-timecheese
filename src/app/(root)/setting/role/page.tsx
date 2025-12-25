import type { Metadata } from 'next';
import { RoleListView } from '@/components/pages/setting/role/view';

export const metadata: Metadata = {
  title: 'Role - Time Cheese',
  description: 'Time Cheese',
};

const RoleSetting = () => {
  return <RoleListView />;
};

export default RoleSetting;
