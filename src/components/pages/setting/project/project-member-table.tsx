import { ComboboxForm } from '@/components/ui/custom/combobox';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UseFormReturn } from 'react-hook-form';
import { CreateProjectSchemaType, EditProjectSchemaType } from './schema';
import { IOptions } from '@/types/dropdown';

export interface ProjectMemberTableProps {
  header: { label: string; className: string }[];
  teamOptions: IOptions[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
}

const ProjectMemberTable = ({ header, teamOptions, form }: ProjectMemberTableProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="member"
        render={({ field: parentField }) => (
          <FormItem>
            <FormControl>
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-[#f2f4f7]">
                    {header.map(({ label, className }) => (
                      <TableHead key={label} className={className}>
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parentField.value.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={header.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        ไม่มีข้อมูล
                      </TableCell>
                    </TableRow>
                  ) : (
                    parentField.value.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {
                            <FormField
                              control={form.control}
                              name={`member.${index}.team_id`}
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormControl>
                                    <ComboboxForm
                                      placeholder="เลือกทีม"
                                      options={teamOptions}
                                      field={field}
                                      onSelect={(value) => field.onChange(value)}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          {
                            <FormField
                              control={form.control}
                              name={`member.${index}.user_id`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={item.user_id}
                                      maxLength={100}
                                      onChange={(e) => {
                                        const details = [...parentField.value];
                                        details[index].user_id = e.target.value;
                                        parentField.onChange(details);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          {
                            <FormField
                              control={form.control}
                              name={`member.${index}.position`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={item.position}
                                      maxLength={100}
                                      onChange={(e) => {
                                        const details = [...parentField.value];
                                        details[index].position = e.target.value;
                                        parentField.onChange(details);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          {
                            <FormField
                              control={form.control}
                              name={`member.${index}.day_price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={item.day_price}
                                      maxLength={100}
                                      onChange={(e) => {
                                        const details = [...parentField.value];
                                        details[index].position = e.target.value;
                                        parentField.onChange(details);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          {
                            <FormField
                              control={form.control}
                              name={`member.${index}.start_date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <DatePickerInput
                                      value={item.start_date}
                                      placeholder="กรุณาเลือกวันที่เริ่มต้น"
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          {
                            <FormField
                              control={form.control}
                              name={`member.${index}.end_date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <DatePickerInput
                                      value={item.end_date}
                                      placeholder="กรุณาเลือกวันที่สิ้นสุด"
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
export default ProjectMemberTable;
