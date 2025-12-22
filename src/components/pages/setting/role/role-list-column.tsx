'use client';

import {
  ActionColumn,
  ButtonDelete,
  ButtonEdit,
  SortColumn,
} from '@/components/ui/custom/data-table';
import { IRole } from '@/types/setting/role';
import { ColumnDef } from '@tanstack/react-table';

const nameColumn = SortColumn<IRole>('name', 'ชื่อสิทธื์การใช้งาน');
const descriptionColumn = SortColumn<IRole>('description', 'คำอธิบาย');
const createdByColumn = SortColumn<IRole>('createdBy', 'ผู้แก้ไข', 'center');
const updatedAtColumn = SortColumn<IRole>('updatedAt', 'วันที่แก้ไขล่าสุด', 'center');
const actionColumn = ActionColumn<IRole>('actions', 'จัดการ');

type createColumnsProps = {
  onOpenDialog: (
    mode: 'edit' | 'delete',
    isActive: boolean,
    id: string,
    data: { code: string }
  ) => void;
};
export const createColumns = ({ onOpenDialog }: createColumnsProps): ColumnDef<IRole>[] => {
  const baseColumns: ColumnDef<IRole>[] = [
    {
      ...nameColumn,
      size: 100,
      cell: ({ row }) => {
        const { name } = row.original;
        return <div>{name || '-'}</div>;
      },
    },
    {
      ...descriptionColumn,
      size: 500,
      cell: ({ row }) => {
        const { description } = row.original;
        return <div>{description || '-'}</div>;
      },
    },
    {
      ...createdByColumn,
      size: 100,
      cell: ({ row }) => {
        const { fullName } = row.original;
        return <div className="text-center">{fullName || '-'}</div>;
      },
    },
    {
      ...updatedAtColumn,
      size: 100,
      cell: ({ row }) => {
        const { updatedAt } = row.original;
        return <div className="text-center">{updatedAt?.toLocaleDateString() || '-'}</div>;
      },
    },
    {
      ...actionColumn,
      size: 200,
      cell: ({ row }) => {
        const { id, code, isActive } = row.original;
        return (
          <div className="flex justify-center space-x-1">
            <ButtonEdit onClick={() => onOpenDialog('edit', isActive, id, { code })} />
            <ButtonDelete
              onOpenDialog={() => onOpenDialog('delete', isActive, id, { code })}
              id={id}
              data={{ code }}
            />
          </div>
        );
      },
    },
  ];
  return baseColumns;
};
