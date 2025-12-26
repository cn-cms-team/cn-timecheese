import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { IOptionGroups } from '@/types/dropdown';

interface DropdownGroupProps {
  value?: string;
  onChange: (value: string) => void;
  groups: IOptionGroups[];
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
}

export function DropdownGroup({
  value,
  onChange,
  groups,
  placeholder = 'กรุณาเลือก',
  disabled = false,
  isError = false,
}: DropdownGroupProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger className={cn('w-full', isError && 'border border-destructive')}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-full">
        {groups.map((group) => (
          <SelectGroup key={group.label} className="p-3">
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="px-3">{option.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
