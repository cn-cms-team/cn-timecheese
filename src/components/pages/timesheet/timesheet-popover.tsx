'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

interface IProps {
  align?: 'start' | 'center' | 'end' | undefined;
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined;
  className?: string;
  triggerContent: React.ReactNode;
  propOpen?: boolean;
  setPropOpen?: (open: boolean) => void;
  popoverContent: (close: () => void) => React.ReactNode;
  setIsEdit?: (isEdit: boolean) => void;
}

const TimeSheetPopover = ({
  align = 'center',
  side = 'bottom',
  className = '',
  triggerContent,
  propOpen = undefined,
  setPropOpen = undefined,
  popoverContent,
  setIsEdit = undefined,
}: IProps) => {
  const [open, setOpen] = useState(false);
  const isControlled = propOpen !== undefined;
  const actualOpen = propOpen ?? open;

  return (
    <Popover
      open={actualOpen}
      onOpenChange={(nextOpen) => {
        if (isControlled) {
          setPropOpen?.(nextOpen);
        } else {
          setOpen(nextOpen);
        }

        setIsEdit?.(false);
      }}
    >
      <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {popoverContent(() => setOpen(false))}
      </PopoverContent>
    </Popover>
  );
};

export default TimeSheetPopover;
