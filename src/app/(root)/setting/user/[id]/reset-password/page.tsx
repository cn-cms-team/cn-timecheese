import type { Metadata } from 'next';

import { ResetPasswordView } from '@/components/pages/setting/user/view';

export const metadata: Metadata = {
  title: 'User Reset Password - Time cheese',
  description: 'Time cheese',
};

const UserResetPasswordPage = async () => {
  return <ResetPasswordView />;
};

export default UserResetPasswordPage;
