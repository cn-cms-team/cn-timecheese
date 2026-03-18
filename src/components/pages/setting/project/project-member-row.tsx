import { UseFormReturn, useWatch } from 'react-hook-form';
import { TableCell, TableRow } from '@/components/ui/table';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { Input } from '@/components/ui/input';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { IOptionGroups, IOptions } from '@/types/dropdown';
import { UserInfo } from '@/types/setting/project';
import { CreateProjectSchemaType, EditProjectSchemaType } from './schema';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface ProjectMemberTableProps {
  index: number;
  userOptions: IOptionGroups[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
  onDelete: (index: number) => void;
}

const ProjectMemberRow = ({ index, form, userOptions, onDelete }: ProjectMemberTableProps) => {
  const isUsing = useWatch({
    control: form.control,
    name: `member.${index}.is_using`,
  });
  const members = useWatch({
    control: form.control,
    name: 'member',
  });

  const selectedUserId = members?.[index]?.user_id;
  const selectedUserIdsInOtherRows = new Set(
    (members ?? [])
      .map((member, memberIndex) => (memberIndex === index ? '' : member?.user_id))
      .filter((userId): userId is string => Boolean(userId))
  );

  const availableUserOptions = userOptions.map((group) => ({
    ...group,
    options: group.options.filter(
      (option) => option.value === selectedUserId || !selectedUserIdsInOtherRows.has(option.value)
    ),
  }));

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
                  options={availableUserOptions}
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
          name={`member.${index}.start_date`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePickerInput
                  {...field}
                  value={field.value ? new Date(field.value) : undefined}
                  placeholder="วันที่เริ่มต้น"
                  onChange={field.onChange}
                  allowClear
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
                  allowClear
                />
              </FormControl>
            </FormItem>
          )}
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
          <Trash2 width={20} height={20} className={isUsing ? 'text-gray-700' : 'text-red-700'} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProjectMemberRow;
