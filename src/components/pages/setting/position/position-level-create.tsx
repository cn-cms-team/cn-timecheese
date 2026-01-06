import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { CreatePositionSchemaType, EditPositionSchemaType } from './schema';
import { Control } from 'react-hook-form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';
interface Props {
  index: number;
  control: Control<CreatePositionSchemaType | EditPositionSchemaType>;
  onRemove: () => void;
  totalFields: number;
  is_used?: boolean;
}

const PositionLevelCreate = ({ index, control, onRemove, totalFields, is_used = false }: Props) => {
  return (
    <div className="w-full h-full border rounded-sm py-5 px-3 mt-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="bg-yellow-500 px-2 rounded-md text-white">{index + 1}</span>
          <h1>Level</h1>
        </div>
        {totalFields > 1 && (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={is_used}
                onClick={onRemove}
                className={`${
                  is_used
                    ? 'cursor-not-allowed opacity-50 text-gray-400'
                    : 'cursor-pointer text-red-500 hover:text-red-700'
                }`}
              >
                <Trash2 size={20} />
              </button>
            </TooltipTrigger>
            { is_used && (
              <TooltipContent>
                <p>ระดับตำแหน่งถูกใช้งานอยู่</p>
              </TooltipContent>
            )}
          </Tooltip>
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
                  maxLength={MAX_LENGTH_255}
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
