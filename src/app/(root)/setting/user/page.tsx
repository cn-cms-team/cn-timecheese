import { UserListView } from '@/components/pages/setting/user/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User - CN Timesheet',
  description: 'CN Timesheet',
};

const UserSetting = () => {
  return <UserListView />;
};

export default UserSetting;
