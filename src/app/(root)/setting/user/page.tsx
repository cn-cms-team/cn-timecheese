import { UserListView } from '@/components/pages/setting/user/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User - Time Cheese',
  description: 'Time Cheese',
};

const UserSetting = () => {
  return <UserListView />;
};

export default UserSetting;
