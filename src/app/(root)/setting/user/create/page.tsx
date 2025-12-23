import { UserCreateView } from '@/components/pages/setting/user/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create User - Time Cheese',
  description: 'Time Cheese',
};

const UserCreateSetting = async () => {
  return <UserCreateView />;
};

export default UserCreateSetting;
