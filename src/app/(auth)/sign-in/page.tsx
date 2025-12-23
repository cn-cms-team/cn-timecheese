import type { Metadata } from 'next';

import { SignInView } from '@/components/pages/sign-in/view';

export const metadata: Metadata = {
  title: 'Sign-in - Time Cheese',
  description: 'Time Cheese',
  openGraph: {
    title: 'Time Cheese',
    images: [
      {
        url: '',
        width: 600,
        height: 600,
        alt: 'Time Cheese',
      },
    ],
  },
};

const SignIn = async () => {
  return <SignInView />;
};

export default SignIn;
