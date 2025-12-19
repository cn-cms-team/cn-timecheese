import { UserCreateView } from '@/components/pages/setting/user/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit User - CN Timesheet',
  description: 'CN Timesheet',
};

const UserEditSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <UserCreateView id={id} />;
};

export default UserEditSetting;
