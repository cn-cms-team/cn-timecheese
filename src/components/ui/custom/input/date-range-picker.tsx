'use client';

import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { Button } from '../../button';
import { cn } from '@/lib/utils';
import { Calendar1 } from 'lucide-react';
import { formatDate } from '@/lib/functions/date-format';

interface IProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  selected: DateRange | undefined;
  isError?: boolean;
  onSelect: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  selected = undefined,
  disabled = false,
  placeholder = 'เลือกช่วงวันที่',
  className,
  isError = false,
  onSelect,
}: IProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(className, 'w-full')}>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            `w-full justify-between font-normal relative truncate ${className ?? ''}`,
            isError ? 'border-red-500' : ''
          )}
        >
          <span className={cn('truncate', selected ? '' : 'text-gray-500')}>
            {selected
              ? `${formatDate(selected.from, 'dd-mmm-yyyy')} - ${formatDate(
                  selected.to,
                  'dd-mmm-yyyy'
                )}`
              : placeholder}
          </span>
          <Calendar1 className="h-4 w-4 opacity-50 text-black" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          defaultMonth={selected?.from || undefined}
          selected={selected}
          onSelect={onSelect}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
}
