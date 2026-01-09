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
import { IOptions } from '@/types/dropdown';
import { TaskOptions } from '@/types/setting/project';

export type TaskArrayName = 'main_task_type' | 'optional_task_type';

export interface ProjectMemberTableProps {
  header: { label: string; className: string }[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
  name: TaskArrayName;
  typeOption: IOptions[];
  taskOption: TaskOptions[];
}

const ProjectTaskTable = ({
  header,
  form,
  name,
  typeOption,
  taskOption,
}: ProjectMemberTableProps) => {
  const { fields, remove } = useFieldArray({
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
              <div className="border rounded-lg overflow-auto">
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
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={header.length}
                          className="h-24 text-center text-muted-foreground"
                        >
                          ไม่มีข้อมูล
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((item, index) => (
                        <TableRow key={`${name}-${index}`}>
                          <TableCell className="min-w-[150px] max-w-[150px]">
                            {
                              <FormField
                                control={form.control}
                                name={`${name}.${index}.type`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <ComboboxForm
                                        placeholder="เลือกหมวดหมู่"
                                        options={typeOption}
                                        field={field}
                                        isError={
                                          form.formState.errors[name]?.[index]?.type ? true : false
                                        }
                                        onSelect={(value) => {
                                          field.onChange(value);
                                          form.setValue(`${name}.${index}.task_type_id`, null!);
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            }
                          </TableCell>
                          <TableCell className="min-w-[150px] max-w-[150px]">
                            {name === 'main_task_type' ? (
                              <FormField
                                control={form.control}
                                name={`${name}.${index}.task_type_id`}
                                render={({ field }) => {
                                  const selectedType = form.watch(`${name}.${index}.type`);
                                  const filteredTask = taskOption.filter(
                                    (u) => u.type === selectedType
                                  );
                                  return (
                                    <FormItem>
                                      <FormControl>
                                        <ComboboxForm
                                          placeholder={
                                            selectedType ? 'เลือกประเภท' : 'กรุณาเลือกหมวดหมู่'
                                          }
                                          options={filteredTask}
                                          field={field}
                                          disabled={!selectedType}
                                          isError={
                                            !!form.formState.errors[name]?.[index]?.task_type_id
                                          }
                                          onSelect={(value) => {
                                            const taskName =
                                              filteredTask.find((f) => f.value === value)?.label ??
                                              '';
                                            form.setValue(`${name}.${index}.name`, taskName);
                                            field.onChange(value);
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  );
                                }}
                              />
                            ) : (
                              <FormField
                                control={form.control}
                                name={`${name}.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value ?? ''}
                                        maxLength={MAX_LENGTH_100}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            )}
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
                                        value={field.value ?? ''}
                                        maxLength={MAX_LENGTH_255}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            }
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant={'ghost'}
                              onClick={() => {
                                remove(index);
                              }}
                            >
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
