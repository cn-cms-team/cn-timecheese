'use client';

import { Clock } from 'lucide-react';
import { Input } from '../../input';
import { cn } from '@/lib/utils';

interface IProps {
  isError?: boolean;
}

const TimeInput = ({
  className,
  type,
  autoComplete = 'off',
  isError = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & IProps) => {
  return (
    <div className="relative flex w-full">
      <Input
        type="time"
        {...props}
        className={cn(
          '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
          isError && 'border-destructive focus-visible:border-destructive '
        )}
      />
      <Clock className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
};

export default TimeInput;
