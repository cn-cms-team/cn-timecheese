'use client';
import { ColumnDef } from '@tanstack/react-table';

import {
  SortColumn,
  ActionColumn,
  ButtonEdit,
  ButtonDelete,
} from '@/components/ui/custom/data-table';
import LinkTable from '@/components/ui/custom/data-table/link';
import { IProject } from '@/types/setting/project';
import { formatDate } from '@/lib/functions/date-format';

const nameColumn = SortColumn<IProject>('name', 'ชื่อโครงการ');
const codeColumn = SortColumn<IProject>('code', 'รหัสโครงการ');
const startDateColumn = SortColumn<IProject>('start_date', 'วันที่เริ่มต้น');
const endDateColumn = SortColumn<IProject>('end_date', 'วันที่สิ้นสุด');
const actionColumn = ActionColumn<IProject>('actions', 'จัดการ');

type createColumnsProps = {
  onOpenDialog: (mode: 'edit' | 'delete', id: string, data: { name: string }) => void;
};

export const createColumns = ({ onOpenDialog }: createColumnsProps): ColumnDef<IProject>[] => {
  const baseColumns: ColumnDef<IProject>[] = [
    {
      ...nameColumn,
      size: 200,
      cell: ({ row }) => {
        const { name, id } = row.original;
        const viewLink = `/setting/project/${id}`;
        return <LinkTable path={viewLink}>{name}</LinkTable>;
      },
    },
    {
      ...codeColumn,
      size: 200,
      cell: ({ row }) => {
        const { code } = row.original;
        return <div>{code || '-'}</div>;
      },
    },
    {
      ...startDateColumn,
      size: 200,
      cell: ({ row }) => {
        const { start_date } = row.original;
        return start_date ? formatDate(start_date, 'dd/mm/yyyy') : '-';
      },
    },
    {
      ...endDateColumn,
      size: 200,
      cell: ({ row }) => {
        const { end_date } = row.original;
        return end_date ? formatDate(end_date, 'dd/mm/yyyy') : '-';
      },
    },
    {
      ...actionColumn,
      cell: ({ row }) => {
        const { id, name } = row.original;

        return (
          <div className="flex justify-center space-x-1">
            <ButtonEdit onClick={() => onOpenDialog('edit', id, { name })} />
            <ButtonDelete
              onOpenDialog={() => onOpenDialog('delete', id, { name })}
              id={id}
              data={{ name }}
            />
          </div>
        );
      },
    },
  ];
  return baseColumns;
};
