'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

interface IProps {
  align?: 'start' | 'center' | 'end' | undefined;
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined;
  className?: string;
  triggerContent: React.ReactNode;
  popoverContent: (close: () => void) => React.ReactNode;
}

const TimeSheetPopover = ({
  align = 'center',
  side = 'bottom',
  className = '',
  triggerContent,
  popoverContent,
}: IProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
      <PopoverContent align={align} side={side} className={className}>
        {popoverContent(() => setOpen(false))}
      </PopoverContent>
    </Popover>
  );
};

export default TimeSheetPopover;
