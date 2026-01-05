'use client';

import { cn } from '@/lib/utils';
import { IOption } from '@/types/option';

interface IProps {
  value: string | number;
  options?: IOption[];
  onSelect: (value: string | number) => void;
}

const PeriodInput = ({ value, options = [], onSelect }: IProps) => {
  return (
    <div className="border border-gray-300 w-full lg:max-w-md rounded-md flex ">
      {options?.map((item, index) => (
        <div
          key={index}
          className={cn(
            'w-full flex items-center justify-center text-center p-1 cursor-pointer transition-all duration-300 ease-out',
            value === item.value
              ? 'bg-primary text-black font-semibold rounded-md shadow-lg transform translate-x-0'
              : ''
          )}
          onClick={() => onSelect(item.value)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default PeriodInput;
