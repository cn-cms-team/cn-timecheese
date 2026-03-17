'use client';

import * as React from 'react';
import { Calendar1, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/functions/date-format';

type DatePickerInputProps = {
  value?: Date | null;
  onChange?: (date?: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isError?: boolean;
  allowClear?: boolean;
  startMonth?: Date;
  endMonth?: Date;
};

export function DatePickerInput({
  value,
  onChange,
  placeholder = 'Select date',
  disabled,
  className,
  isError,
  allowClear = false,
  startMonth = new Date(new Date().getFullYear() - 5, 0),
  endMonth = new Date(new Date().getFullYear() + 5, 0),
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const canClear = allowClear && value != null && !disabled;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              `w-full justify-between font-normal relative truncate ${canClear ? 'pr-16' : ''} ${className ?? ''}`,
              isError ? 'border-red-500' : ''
            )}
          >
            <span className={cn('truncate', value ? '' : 'text-gray-500')}>
              {value ? formatDate(value) : placeholder}
            </span>
            <Calendar1 className="h-4 w-4 opacity-50 text-black" />
          </Button>
        </PopoverTrigger>

        {canClear && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-8 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-500 hover:text-black"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onChange?.(null);
              setOpen(false);
            }}
            aria-label="Clear date"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
