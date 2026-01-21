'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TableRow, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

interface Props<T extends FieldValues> {
  id: string;
  index: number;
  form: UseFormReturn<T>;
  onDelete: (index: number, name: string) => void;
}

const SortableRow = <T extends FieldValues>({ id, index, form, onDelete }: Props<T>) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isDragging]);

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-8">
        <Button
          className="bg-transparent hover:bg-transparent  text-black"
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical />
        </Button>
      </TableCell>
      <TableCell className="w-10 text-center">{index + 1}</TableCell>
      <TableCell className="min-w-[100px] max-w-[100px]">
        <FormField
          control={form.control}
          name={`levels.${index}.name` as Path<T>}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  maxLength={MAX_LENGTH_100}
                  autoComplete="off"
                  placeholder="กรุณากรอกชื่อระดับ"
                  {...field}
                  onInput={(e) => {
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="min-w-[100px] max-w-[100px]">
        <FormField
          control={form.control}
          name={`levels.${index}.description` as Path<T>}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  maxLength={MAX_LENGTH_255}
                  autoComplete="off"
                  placeholder="กรุณากรอกคำอธิบายระดับ"
                  onInput={(e) => {
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="w-10">
        <Button
          className="bg-transparent text-destructive hover:bg-transparent hover:text-destructive"
          variant="outline"
          type="button"
          onClick={() => onDelete(index, form.getValues(`levels.${index}.name` as Path<T>))}
        >
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SortableRow;
