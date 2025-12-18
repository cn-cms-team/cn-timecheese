import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type InputSearchProps = {
  placeholder?: string;
  globalFilter: string;
  isMaxWidthSm?: boolean;
  disabled?: boolean;
  setGlobalFilter: (value: string) => void;
  onEnter?: () => void;
};
const InputSearch = ({
  placeholder,
  globalFilter,
  setGlobalFilter,
  disabled = false,
  isMaxWidthSm = true,
  onEnter = () => {},
}: InputSearchProps) => {
  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter?.();
    }
  };
  return (
    <div className={`relative w-full ${isMaxWidthSm ? 'max-w-sm' : ''}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder={placeholder || 'Search...'}
        value={globalFilter}
        disabled={disabled}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
        }}
        className={`pl-10 ${isMaxWidthSm ? 'max-w-sm' : ''}`}
        onKeyUp={onPressEnter}
      />
    </div>
  );
};

export default InputSearch;
