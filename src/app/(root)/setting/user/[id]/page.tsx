import { UserView } from '@/components/pages/setting/user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View User - CN Timesheet',
  description: 'CN Timesheet',
};

const UserSetting = () => {
  return <UserView />;
};

export default UserSetting;
