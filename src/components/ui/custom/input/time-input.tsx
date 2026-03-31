'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '../../scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate } from '@/lib/functions/date-format';

interface IProps {
  value?: Date;
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
  isModal?: boolean;
  onChange?: (date: Date) => void;
}

export default function TimeInput({
  value = undefined,
  placeholder = 'เลือกเวลา',
  disabled = false,
  isError = false,
  isModal = false,
  onChange = () => {},
}: IProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedHourButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const selectedMinuteButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  React.useEffect(() => {
    if (!isOpen || !value) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      selectedHourButtonRef.current?.scrollIntoView({
        block: 'center',
        inline: 'center',
      });
      selectedMinuteButtonRef.current?.scrollIntoView({
        block: 'center',
        inline: 'center',
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [isOpen, value]);

  const handleTimeChange = (type: 'hour' | 'minute', selectedValue: string) => {
    if (value) {
      const newDate = new Date(value);
      if (type === 'hour') {
        newDate.setHours(parseInt(selectedValue, 10));
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(selectedValue, 10));
      }
      onChange(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={isModal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            isError && 'border-destructive'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? <span>{formatDate(value, 'HH:ii')}</span> : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <div className="flex flex-col sm:flex-row sm:h-75 divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    ref={value && value.getHours() === hour ? selectedHourButtonRef : undefined}
                    size="icon"
                    variant={value && value.getHours() === hour ? 'default' : 'ghost'}
                    className="sm:w-full shrink-0 aspect-square font-normal"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {hour.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    ref={
                      value && value.getMinutes() === minute ? selectedMinuteButtonRef : undefined
                    }
                    size="icon"
                    variant={value && value.getMinutes() === minute ? 'default' : 'ghost'}
                    className="sm:w-full shrink-0 aspect-square font-normal"
                    onClick={() => handleTimeChange('minute', minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
