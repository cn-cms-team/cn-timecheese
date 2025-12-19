import { UserView } from '@/components/pages/setting/user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View User - CN Timesheet',
  description: 'CN Timesheet',
};

const UserViewSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <UserView id={id} />;
};

export default UserViewSetting;
