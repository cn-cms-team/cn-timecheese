import { FormControl, FormField, FormItem } from '@/components/ui/form';
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
import { IOptionGroups } from '@/types/dropdown';
import ProjectMemberRow from './project-member-row';

export interface ProjectMemberTableProps {
  header: { label: string; className: string }[];
  userOptions: IOptionGroups[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
}

const ProjectMemberTable = ({ header, userOptions, form }: ProjectMemberTableProps) => {
  const { fields, remove } = useFieldArray({
    control: form.control,
    name: 'member',
  });
  return (
    <>
      <FormField
        control={form.control}
        name="member"
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
                        <ProjectMemberRow
                          index={index}
                          form={form}
                          userOptions={userOptions}
                          key={index}
                          onDelete={remove}
                        />
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
export default ProjectMemberTable;
