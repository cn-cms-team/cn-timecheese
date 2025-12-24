import { ComboboxForm } from '@/components/ui/custom/combobox';
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
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { CreateProjectSchemaType, EditProjectSchemaType } from './schema';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';

export type TaskArrayName = 'main_task_type' | 'optional_task_type';

export interface ProjectMemberTableProps {
  header: { label: string; className: string }[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
  name: TaskArrayName;
}

const ProjectTaskTable = ({ header, form, name }: ProjectMemberTableProps) => {
  const { remove } = useFieldArray({
    control: form.control,
    name: name,
  });
  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field: parentField }) => (
          <FormItem>
            <FormControl>
              <div className="border rounded-lg">
                <Table>
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
                                name={`${name}.${index}.type`}
                                render={({ field }) => (
                                  <FormItem className="">
                                    <FormControl>
                                      <ComboboxForm
                                        placeholder="เลือกหมวดหมู่"
                                        options={[]}
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
                                name={`${name}.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      {name === 'main_task_type' ? (
                                        <ComboboxForm
                                          placeholder="เลือกประเภท"
                                          options={[]}
                                          field={field}
                                          onSelect={(value) => field.onChange(value)}
                                        />
                                      ) : (
                                        <Input
                                          {...field}
                                          value={item.name}
                                          maxLength={MAX_LENGTH_100}
                                          onChange={parentField.onChange}
                                        />
                                      )}
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
                                name={`${name}.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={item.description}
                                        maxLength={MAX_LENGTH_255}
                                        onChange={parentField.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            }
                          </TableCell>
                          <TableCell>
                            <Button variant={'ghost'} onClick={() => remove(index)}>
                              <Trash2 width={20} height={20} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
export default ProjectTaskTable;
