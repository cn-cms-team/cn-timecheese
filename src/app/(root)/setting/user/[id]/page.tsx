import { UserView } from '@/components/pages/setting/user/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View User - Time Cheese',
  description: 'Time Cheese',
};

const UserViewSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <UserView id={id} />;
};

export default UserViewSetting;
