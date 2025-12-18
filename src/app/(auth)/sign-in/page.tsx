import type { Metadata } from 'next';

import { SignInView } from '@/components/pages/sign-in/view';

export const metadata: Metadata = {
  title: 'Sign-in - CN Timesheet',
  description: 'CN Timesheet',
  openGraph: {
    title: 'CN Timesheet',
    images: [
      {
        url: '',
        width: 600,
        height: 600,
        alt: 'CN Timesheet',
      },
    ],
  },
};

const SignIn = async () => {
  return <SignInView />;
};

export default SignIn;
