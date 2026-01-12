'use client';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface IProps {
  triggerNode: React.ReactNode;
  contentNode: React.ReactNode;
  contentClass?: string;
  triggerClass?: string;
  arrowClass?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  avoidCollisions?: boolean;
}

const Tooltips = ({
  triggerNode,
  contentNode,
  triggerClass,
  contentClass = 'bg-black',
  side,
  arrowClass = 'bg-black fill-black',
  avoidCollisions = true,
}: IProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        className={triggerClass}
        asChild
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {triggerNode}
      </TooltipTrigger>
      <TooltipContent
        avoidCollisions={avoidCollisions}
        arrowClass={arrowClass}
        side={side || undefined}
        className={cn(contentClass, 'max-w-[400px]')}
      >
        {contentNode}
      </TooltipContent>
    </Tooltip>
  );
};

export default Tooltips;
