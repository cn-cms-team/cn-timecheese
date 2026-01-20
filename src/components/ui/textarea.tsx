import * as React from 'react';

import { cn } from '@/lib/utils';

interface IProps {
  isError?: boolean;
}

function Textarea({ className, isError, ...props }: React.ComponentProps<'textarea'> & IProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input dark:bg-input/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] aria-invalid:ring-[3px] md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-primary-light focus-visible:ring-ring/50 focus-visible:ring-1',
        isError && 'border-destructive border',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
