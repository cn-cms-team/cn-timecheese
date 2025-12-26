import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { CreatePositionSchemaType, EditPositionSchemaType } from "./schema";
import { Control } from 'react-hook-form';
interface Props {
  index: number;
  control: Control<CreatePositionSchemaType | EditPositionSchemaType>;
  onRemove: () => void;
  totalFields: number;
}

const PositionLevelCreate = ({ index, control, onRemove, totalFields }: Props) => {
  return (
    <div className="w-full h-full border rounded-sm py-5 px-3 mt-10">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="bg-yellow-500 px-2 rounded-md text-white">{index + 1}</span>
          <h1>Level</h1>
        </div>
        {totalFields > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
      <div>
        <FormField
          control={control}
          name={`levels.${index}.name`}
          render={({ field }) => (
            <FormItem className="w-full mt-5">
              <FormLabel>
                ชื่อระดับ <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  maxLength={100}
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

        <FormField
          control={control}
          name={`levels.${index}.description`}
          render={({ field }) => (
            <FormItem className="w-full mt-5">
              <FormLabel className="text-sm font-medium">คำอธิบาย</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  maxLength={255}
                  className="h-20"
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
      </div>
    </div>
  );
};

export default PositionLevelCreate;
