import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type ButtonDeleteProps<T> = {
  onOpenDialog: (id: string, data: T) => void;
  id: string;
  disabled?: boolean;
  data: T;
};
const ButtonDelete = <T,>({ id, disabled = false, onOpenDialog, data }: ButtonDeleteProps<T>) => {
  return (
    <Button
      variant="outline"
      className="bg-white hover:bg-gray-100"
      disabled={disabled}
      onClick={() => onOpenDialog(id, data)}
    >
      <Trash2 className={disabled ? 'text-gray-700' : 'text-red-700'} />
    </Button>
  );
};

export default ButtonDelete;
