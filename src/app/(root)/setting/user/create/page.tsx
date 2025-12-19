import { UserCreateView } from '@/components/pages/setting/user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create User - CN Timesheet',
  description: 'CN Timesheet',
};

const UserCreateSetting = async () => {
  return <UserCreateView />;
};

export default UserCreateSetting;
