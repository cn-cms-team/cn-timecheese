'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ITaskType } from '@/types/setting/task-type';
import BadgeTable from '@/components/ui/custom/data-table/badge';
import { ButtonDelete, ButtonEdit } from '@/components/ui/custom/data-table';

export type TaskArrayName = 'task_type';

export interface TaskTypeTableProps {
  data: ITaskType[];
  onOpenDialog?: (mode: 'edit' | 'delete', id: string) => void;
  mode: 'view' | 'edit';
}

const TaskTypeCreateTable = ({ data, onOpenDialog, mode }: TaskTypeTableProps) => {
  const header = [
    { label: 'ประเภทงาน', className: 'text-start min-w-[100px]' },
    { label: 'คำอธิบาย', className: 'text-start min-w-[200px]' },
    { label: 'สถานะ', className: 'text-center' },
  ];
  if (mode === 'edit') {
    header.push({ label: 'จัดการ', className: 'text-center' });
  }
  return (
    <>
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
            {!data || data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={header.length}
                  className="h-24 text-center text-muted-foreground "
                >
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            ) : (
              data &&
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="text-start">{item.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-start">{item.description || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      {item.is_active ? (
                        <BadgeTable text="ใช้งาน" type="activate" />
                      ) : (
                        <BadgeTable text="ไม่ใช้งาน" type="deactivate" />
                      )}
                    </div>
                  </TableCell>
                  {mode === 'edit' && (
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <ButtonEdit onClick={() => onOpenDialog!('edit', item.id!)} />
                        <ButtonDelete
                          onOpenDialog={() => onOpenDialog!('delete', item.id!)}
                          id={item.id!}
                          data={{ name: item.name }}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export default TaskTypeCreateTable;
