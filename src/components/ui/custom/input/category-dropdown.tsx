'use client';

import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';

export interface ICategoryOption {
  label: string;
  value?: string | number;
  children?: ICategoryOption[];
}

interface IProps {
  options: ICategoryOption[];
  value?: string | number;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  canEmpty?: boolean;
  onSelect?: (value: string | number) => void;
}

const CategoryDropdown = ({
  options = [],
  value = '',
  placeholder = 'เลือก',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  canEmpty = false,
  onSelect = () => {},
}: IProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedLabel =
    options
      .flatMap((opt) => (opt.children ? opt.children : [opt]))
      .find((opt) => String(opt.value) === String(value))?.label || placeholder;

  const handleOptionClick = (optionValue: string | number) => {
    onSelect?.(optionValue);
    buttonRef.current?.blur();
  };

  const renderOption = (option: ICategoryOption, index: number, level = 1): React.ReactNode => {
    const shouldIndent = !(level === 1 && !option.children);
    const paddingClass = shouldIndent ? `ps-${(level + 1) * 4}` : '';

    if (option.children && option.children.length > 0) {
      return (
        <div key={index} className={cn('flex flex-col items-start w-full')}>
          <span className="text-gray-400 text-sm mt-1 ps-2">{option.label}</span>
          {option.children.map((child, idx) => renderOption(child, idx, level + 1))}
        </div>
      );
    }

    return (
      <DropdownMenuItem
        key={option.value}
        onClick={() => handleOptionClick(option.value as string | number)}
        className={cn(
          'py-1 px-2 text-sm cursor-pointer w-full focus:bg-primary-light-green focus:text-black focus:outline-none ems-dropdown-item',
          paddingClass,
          index !== 0 && 'mt-1',
          level !== 1 && 'px-4 ps-6',
          String(option.value) === String(value) && 'active'
        )}
      >
        {option.label}
      </DropdownMenuItem>
    );
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
              `w-full bg-white border border-gray-300 data-[state=open]:border-primary-light 
            `,
              buttonClassName
            )}
            disabled={disabled}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={`font-sans font-normal overflow-hidden text-ellipsis md:max-w-[80%] xl:max-w-[90%] leading-[3]`}
              >
                {selectedLabel === placeholder ? 'ทั้งหมด' : selectedLabel}
              </span>
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
              handleOptionClick(typeof value === 'string' ? '' : 0);
            }}
          />
        )}
        <DropdownMenuContent
          className={cn(
            ` bg-white rounded-lg shadow-lg border w-[var(--radix-dropdown-menu-trigger-width)] py-1`,
            menuClassName
          )}
          align="start"
        >
          <DropdownMenuGroup className="max-h-100 overflow-auto ">
            {options.length > 0 ? (
              options.map((option, index) => renderOption(option, index))
            ) : (
              <div className="flex justify-center items-center p-4 h-30 text-[#585858]/60 text-sm">
                ไม่พบข้อมูล
              </div>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategoryDropdown;
