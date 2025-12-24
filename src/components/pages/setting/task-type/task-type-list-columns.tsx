'use client';
import { ColumnDef } from '@tanstack/react-table';

import { SortColumn, ActionColumn, ButtonEdit } from '@/components/ui/custom/data-table';
import { ITaskMenu } from '@/types/setting/task-type';
import LinkTable from '@/components/ui/custom/data-table/link';

const nameColumn = SortColumn<ITaskMenu>('name', 'ชื่อ');
const descriptionColumn = SortColumn<ITaskMenu>('description', 'คำอธิบาย');
const actionColumn = ActionColumn<ITaskMenu>('actions', 'จัดการ');

type createColumnsProps = {
  onOpenDialog: (mode: 'edit', id: string, data: { name: string }) => void;
};

export const createColumns = ({ onOpenDialog }: createColumnsProps): ColumnDef<ITaskMenu>[] => {
  const baseColumns: ColumnDef<ITaskMenu>[] = [
    {
      ...nameColumn,
      cell: ({ row }) => {
        const { name, id } = row.original;
        const viewLink = `/setting/task-type/${id}`;
        return <LinkTable path={viewLink}>{name}</LinkTable>;
      },
    },
    {
      ...descriptionColumn,

      cell: ({ row }) => {
        const { description } = row.original;
        return <div>{description || '-'}</div>;
      },
    },
    {
      ...actionColumn,
      cell: ({ row }) => {
        const { id, name } = row.original;

        return (
          <div className="flex justify-center gap-2">
            <ButtonEdit onClick={() => onOpenDialog('edit', id, { name })} />
          </div>
        );
      },
    },
  ];
  return baseColumns;
};
