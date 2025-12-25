'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'cursor-pointer',
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
          'data-[state=checked]:before:absolute data-[state=checked]:before:h-2.5 data-[state=checked]:before:w-0.5 data-[state=checked]:before:left-1/2 data-[state=checked]:before:top-[-2px] data-[state=checked]:before:translate-y-1/2 data-[state=checked]:before:rotate-45 data-[state=checked]:before:bg-primary',
          'data-[state=checked]:after:absolute data-[state=checked]:after:h-1 data-[state=checked]:after:w-0.5 data-[state=checked]:after:top-[5px] data-[state=checked]:after:left-[20%] data-[state=checked]:after:translate-y-1/2 data-[state=checked]:after:rotate-[140deg] data-[state=checked]:after:bg-primary'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
