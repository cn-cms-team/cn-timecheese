import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { TableCell, TableRow } from '@/components/ui/table';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { Input } from '@/components/ui/input';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { IOptions } from '@/types/dropdown';
import { UserInfo } from '@/types/setting/project';
import { CreateProjectSchemaType, EditProjectSchemaType } from './schema';
import { MAX_LENGTH_20 } from '@/lib/constants/validation';
import { calcTotalDays } from '@/lib/functions/date-format';

export interface ProjectMemberTableProps {
  index: number;
  teamOptions: IOptions[];
  userOptions: UserInfo[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
}

const ProjectMemberRow = ({ index, form, teamOptions, userOptions }: ProjectMemberTableProps) => {
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
          name={`member.${index}.team_id`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ComboboxForm
                  placeholder="เลือกทีม"
                  options={teamOptions}
                  field={field}
                  isError={!!form.formState.errors.member?.[index]?.team_id}
                  onSelect={(value) => {
                    field.onChange(value);
                    form.setValue(`member.${index}.user_id`, null!);
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
          name={`member.${index}.user_id`}
          render={({ field }) => {
            const selectedTeamId = form.watch(`member.${index}.team_id`);
            const filteredUsers = userOptions.filter((u) => u.team_id === selectedTeamId);
            return (
              <FormItem>
                <FormControl>
                  <ComboboxForm
                    placeholder={selectedTeamId ? 'เลือกพนักงาน' : 'กรุณาเลือกทีม'}
                    options={filteredUsers}
                    field={field}
                    disabled={!selectedTeamId}
                    isError={!!form.formState.errors.member?.[index]?.user_id}
                    onSelect={(value) => {
                      field.onChange(value);
                      const selectedUser = filteredUsers.find((u) => u.value === value);

                      if (selectedUser) {
                        form.setValue(`member.${index}.role`, selectedUser.position);
                        form.clearErrors(`member.${index}.role`);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            );
          }}
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
                  {...field}
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
                  value={field.value}
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
          render={({ field }) => <div>{field.value ? field.value.toLocaleString() : ''}</div>}
        />
      </TableCell>
      <TableCell className="text-center">
        <FormField
          control={form.control}
          name={`member.${index}.estimated_cost`}
          render={({ field }) => <div>{field.value ? field.value.toLocaleString() : ''}</div>}
        />
      </TableCell>
    </TableRow>
  );
};

export default ProjectMemberRow;
