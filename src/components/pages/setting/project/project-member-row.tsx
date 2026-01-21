import { useEffect } from 'react';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { TableCell, TableRow } from '@/components/ui/table';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { Input } from '@/components/ui/input';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { IOptionGroups, IOptions } from '@/types/dropdown';
import { UserInfo } from '@/types/setting/project';
import { CreateProjectSchemaType, EditProjectSchemaType } from './schema';
import { MAX_LENGTH_20 } from '@/lib/constants/validation';
import { calcTotalDays } from '@/lib/functions/date-format';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface ProjectMemberTableProps {
  index: number;
  userOptions: IOptionGroups[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
  onDelete: (index: number) => void;
}

const ProjectMemberRow = ({ index, form, userOptions, onDelete }: ProjectMemberTableProps) => {
  const startDate = useWatch({
    control: form.control,
    name: `member.${index}.start_date`,
  });

  const endDate = useWatch({
    control: form.control,
    name: `member.${index}.end_date`,
  });

  const costPerDay = useWatch({
    control: form.control,
    name: `member.${index}.day_price`,
  });

  const isUsing = useWatch({
    control: form.control,
    name: `member.${index}.is_using`,
  });

  useEffect(() => {
    const totalDays =
      startDate && endDate ? calcTotalDays(startDate.toString(), endDate.toString()) : 0;
    const estimatedCost = totalDays && costPerDay ? totalDays * costPerDay : 0;

    form.setValue(`member.${index}.work_day`, totalDays ?? 0);
    form.setValue(`member.${index}.estimated_cost`, estimatedCost);
  }, [startDate, endDate, costPerDay, index, form]);

  return (
    <TableRow key={index}>
      <TableCell>
        <FormField
          control={form.control}
          name={`member.${index}.user_id`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ComboboxForm
                  key={index}
                  isGroup={true}
                  field={field}
                  placeholder="เลือกพนักงาน"
                  options={userOptions}
                  onSelect={(value) => {
                    field.onChange(value);
                    const selectedUser = userOptions
                      .flatMap((group) => group.options)
                      .find((option) => option.value === value) as IOptions & UserInfo;
                    form.setValue(`member.${index}.role`, selectedUser.position || '');
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`member.${index}.role`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} value={field.value} maxLength={100} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`member.${index}.day_price`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  maxLength={MAX_LENGTH_20}
                  min={0}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`member.${index}.start_date`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePickerInput
                  {...field}
                  value={field.value}
                  placeholder="วันที่เริ่มต้น"
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`member.${index}.end_date`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePickerInput
                  {...field}
                  value={field.value ? new Date(field.value) : undefined}
                  placeholder="วันที่สิ้นสุด"
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-center">
        <FormField
          control={form.control}
          name={`member.${index}.work_day`}
          render={({ field }) => <div>{field.value ? field.value.toLocaleString() : 0}</div>}
        />
      </TableCell>
      <TableCell className="text-center">
        <FormField
          control={form.control}
          name={`member.${index}.estimated_cost`}
          render={({ field }) => <div>{field.value ? field.value.toLocaleString() : 0}</div>}
        />
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant={'ghost'}
          disabled={isUsing}
          onClick={() => {
            onDelete(index);
          }}
        >
          {isUsing}
          <Trash2 width={20} height={20} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProjectMemberRow;
