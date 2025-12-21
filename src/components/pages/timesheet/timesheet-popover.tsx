'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

interface IProps {
  align?: 'start' | 'center' | 'end' | undefined;
  className?: string;
  triggerContent: React.ReactNode;
  popoverContent: (close: () => void) => React.ReactNode;
}

const TimeSheetPopover = ({
  align = 'center',
  className = '',
  triggerContent,
  popoverContent,
}: IProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={() => setOpen(true)}>
        {triggerContent}
      </PopoverTrigger>
      <PopoverContent align={align} className={className}>
        {popoverContent(() => setOpen(false))}
      </PopoverContent>
    </Popover>
  );
};

export default TimeSheetPopover;
