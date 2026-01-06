import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../command';
import { X } from 'lucide-react';
import { IOptions } from '@/types/dropdown';

export interface DropdownOption<T extends string | number> {
  label: string;
  value: T;
}

interface DropdownProps<T extends string | number> {
  options: DropdownOption<T>[] | IOptions[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  isAllPlaceHolder?: boolean;
  className?: string;
  canEmpty?: boolean;
  isEdit?: boolean;
  canSearch?: boolean;
}

const Dropdown = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'เลือกตัวเลือก',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  className = '',
  isAllPlaceHolder = true,
  canEmpty = false,
  isEdit = false,
  canSearch = false,
}: DropdownProps<T>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  const handleOptionClick = (optionValue: T) => {
    onChange?.(optionValue);
    buttonRef.current?.blur();
  };
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('w-full relative', className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            className={cn(
              'w-full bg-white border border-input data-[state=open]:border-primary-light px-3',
              buttonClassName
            )}
            disabled={disabled}
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-[75%] truncate text-start">
                <span className={`text-sm font-sans font-medium leading-[3]`}>
                  {!value && options.length > 0 && !isEdit && isAllPlaceHolder
                    ? 'ทั้งหมด'
                    : selectedLabel}
                </span>
              </div>
              <div className={open ? 'rotate-180' : ''}>
                <ChevronDownIcon />
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        {canEmpty && value && (
          <X
            className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer hover:text-black z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick((typeof value === 'string' ? '' : '') as T);
            }}
          />
        )}
        <DropdownMenuContent
          className={cn(
            'p-0 bg-white rounded-lg shadow-lg w-[var(--radix-dropdown-menu-trigger-width)] border',
            menuClassName
          )}
          align="start"
        >
          <DropdownMenuGroup className="px-0">
            <Command
              filter={(value, search) => {
                if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                return 0;
              }}
            >
              {(canSearch || (options && options.length > 10)) && (
                <CommandInput placeholder={placeholder} className="h-9 px-2 leading-[3]" />
              )}
              <CommandList>
                <CommandEmpty className="opacity-50 p-3 text-sm">ไม่พบข้อมูล</CommandEmpty>
                <CommandGroup>
                  {options && options.length > 0 ? (
                    options?.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        className={item.value === value ? 'active' : ''}
                        onSelect={() => {
                          handleOptionClick(item.value as T);
                          setOpen(false);
                        }}
                      >
                        {item.label}
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>ไม่มีข้อมูล</CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dropdown;
