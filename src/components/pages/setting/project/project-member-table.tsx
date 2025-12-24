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
import { UserInfo } from '@/types/setting/project';
import { differenceInCalendarDays, differenceInBusinessDays } from 'date-fns';
import ProjectMemberRow from './project-member-row';

export interface ProjectMemberTableProps {
  header: { label: string; className: string }[];
  teamOptions: IOptions[];
  userOptions: UserInfo[];
  form: UseFormReturn<EditProjectSchemaType | CreateProjectSchemaType>;
}

const ProjectMemberTable = ({
  header,
  teamOptions,
  userOptions,
  form,
}: ProjectMemberTableProps) => {
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
                      <ProjectMemberRow
                        index={index}
                        form={form}
                        teamOptions={teamOptions}
                        userOptions={userOptions}
                        key={index}
                      />
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
