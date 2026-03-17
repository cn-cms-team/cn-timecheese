import type { Metadata } from 'next';
import { auth } from '@/auth';
import { ResetPasswordView } from '@/components/pages/setting/user/view';

export const metadata: Metadata = {
  title: 'User Change Password - Time cheese',
  description: 'Time cheese',
};

const UserChangePasswordPage = async () => {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return <ResetPasswordView id={session.user.id} />;
};

export default UserChangePasswordPage;
