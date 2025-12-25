import type { Metadata } from 'next';
import { RoleCreateView } from '@/components/pages/setting/role/view';

export const metadata: Metadata = {
  title: 'Create Role - Time Cheese',
  description: 'Time Cheese',
};

const RoleCreateSetting = async () => {
  return <RoleCreateView />;
};

export default RoleCreateSetting;
