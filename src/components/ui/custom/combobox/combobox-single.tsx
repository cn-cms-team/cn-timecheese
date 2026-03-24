'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ComboboxSingleOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ComboboxSingleGroup {
  heading: string;
  options: ComboboxSingleOption[];
}

interface ComboboxSingleProps {
  options: ComboboxSingleGroup[];
  value?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  emptyText?: string;
  modalPopover?: boolean;
  onValueChange: (value: string) => void;
}

export default function ComboboxSingle({
  options,
  value = '',
  placeholder = 'Select option',
  searchPlaceholder = 'Search options...',
  disabled = false,
  className,
  searchable = true,
  emptyText = 'No results found.',
  modalPopover = true,
  onValueChange,
}: ComboboxSingleProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.flatMap((group) => group.options).find((option) => option.value === value),
    [options, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modalPopover}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn('w-full justify-between', className)}
        >
          <span
            className={cn(
              'truncate text-left font-medium',
              !selectedOption && 'text-muted-foreground'
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          {searchable && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((group) => (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.options.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      disabled={option.disabled}
                      onSelect={() => {
                        if (option.disabled) {
                          return;
                        }
                        onValueChange(option.value);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
