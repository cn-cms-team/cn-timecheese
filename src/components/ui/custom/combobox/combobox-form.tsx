import { Fragment, useRef, useState } from 'react';

import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IOptionGroups, IOptions } from '@/types/dropdown';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X } from 'lucide-react';
import { CommandEmpty } from 'cmdk';

type ComboboxFormProps<TFieldValues extends FieldValues> = {
  options: IOptions[] | IOptionGroups[] | undefined;
  placeholder: string;
  field: ControllerRenderProps<TFieldValues>;
  onSelect: (value: string) => void;
  disabled?: boolean;
  canEmpty?: boolean;
  isError?: boolean;
  isGroup?: boolean;
};
const ComboboxForm = <TFieldValues extends FieldValues>({
  options,
  placeholder,
  field,
  onSelect,
  disabled = false,
  canEmpty = false,
  isError = false,
  isGroup = false,
}: ComboboxFormProps<TFieldValues>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const handleOptionClick = (optionValue: string) => {
    onSelect?.(optionValue);
    buttonRef.current?.blur();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <div className="relative truncate">
          <Button
            type="button"
            ref={buttonRef}
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-between bg-white relative px-3 leading-[3]',
              !field.value && 'text-muted-foreground',
              open && 'border-primary-light',
              !open && isError && 'boder-1 border-destructive'
            )}
            disabled={disabled}
          >
            <div className="truncate text-sm font-medium max-w-[95%]">
              {field.value && isGroup
                ? options
                    ?.flatMap((item) => {
                      if (item.options && item.options.length > 0) {
                        return item.options;
                      }
                      return item;
                    })
                    .find((language) => language.value === field.value)?.label
                : field.value
                ? (options as IOptions[])?.find((language) => language.value === field.value)?.label
                : placeholder}
            </div>
            <div className={`ms-auto ${open ? 'rotate-180' : ''}`}>
              <ChevronDownIcon />
            </div>
          </Button>
          {canEmpty && field.value && (
            <X
              className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer hover:text-black z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(typeof field.value === 'string' ? '' : '');
              }}
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          {options && options.length > 0 && (
            <CommandInput placeholder={placeholder} className="h-9 leading-[3]" />
          )}
          <CommandList>
            <CommandEmpty className="opacity-50 p-3 text-sm">ไม่พบข้อมูล</CommandEmpty>

            {isGroup && options && options.length > 0 ? (
              options?.map((groupItem, gIndex) => (
                <CommandGroup heading={groupItem.label} key={`${groupItem.label}-${gIndex}`}>
                  {groupItem.options?.map((item: IOptions, index: number) => (
                    <CommandItem
                      value={item.label}
                      key={`${item.value}-${index}`}
                      className={`tc-dropdown-item ps-5 mt-1 ${
                        item.value === field.value ? 'active' : ''
                      }`}
                      onSelect={() => {
                        onSelect(item.value as string);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandGroup>
                {options && options.length > 0 ? (
                  (options as IOptions[])?.map((item, index) => (
                    <CommandItem
                      value={item.label}
                      key={`${item.value}-${index}`}
                      className={`tc-dropdown-item mt-1 ${
                        item.value === field.value ? 'active' : ''
                      }`}
                      onSelect={() => {
                        onSelect(item.value as string);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem disabled className="tc-dropdown-item">
                    ไม่มีข้อมูล
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxForm;
