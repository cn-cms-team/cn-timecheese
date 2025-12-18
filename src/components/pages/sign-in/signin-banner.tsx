'use client';

import { cn } from '@/lib/utils';
import animationJson from './TimeTableLogoAnimation.json';
import { useLottie } from 'lottie-react';

const SignInBanner = ({ className }: React.ComponentProps<'div'>) => {
  const defaultOptions = {
    animationData: structuredClone(animationJson),
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return <div className={cn('w-full', className)}>{View}</div>;
};

export default SignInBanner;
