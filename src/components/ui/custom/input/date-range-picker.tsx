'use client';

import { useState } from 'react';
import { ModifiersClassNames, type DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { Button } from '../../button';
import { cn } from '@/lib/utils';
import { Calendar1, X } from 'lucide-react';
import { formatDate } from '@/lib/functions/date-format';

interface IProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  selected: DateRange | undefined;
  canClear?: boolean;
  isError?: boolean;
  onSelect: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  selected = undefined,
  disabled = false,
  placeholder = 'เลือกช่วงวันที่',
  className,
  canClear = false,
  isError = false,
  onSelect,
}: IProps) {
  const [open, setOpen] = useState(false);

  const modifiers: ModifiersClassNames = {
    range_middle: '!bg-gray-200 text-black',
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn(className, 'w-full relative')}>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              `w-full justify-between font-normal  truncate ${className ?? ''}`,
              isError ? 'border-red-500' : ''
            )}
          >
            <span className={cn('truncate', selected ? '' : 'text-gray-500')}>
              {selected
                ? `${formatDate(selected.from, 'dd/mm/yyyy')} - ${formatDate(
                    selected.to,
                    'dd/mm/yyyy'
                  )}`
                : placeholder}
            </span>
          </Button>
          <div className="flex gap-1 absolute right-2 top-1/2 -translate-y-1/2 items-center">
            {canClear && selected && (
              <X className="cursor-pointer" width={16} onClick={handleClear} />
            )}
            <Calendar1 className="h-4 w-4 opacity-50 text-black" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          defaultMonth={selected?.from || undefined}
          selected={selected}
          onSelect={onSelect}
          showOutsideDays={false}
          className="rounded-lg border shadow-sm"
          modifiersClassNames={modifiers}
        />
      </PopoverContent>
    </Popover>
  );
}
