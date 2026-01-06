'use client';

import { Account } from '@/components/context/app-context';
import {
  ActionColumn,
  ButtonDelete,
  ButtonEdit,
  SortColumn,
} from '@/components/ui/custom/data-table';
import LinkTable from '@/components/ui/custom/data-table/link';
import { EModules } from '@/lib/constants/module';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { IRole } from '@/types/setting/role';
import { ColumnDef } from '@tanstack/react-table';

const nameColumn = SortColumn<IRole>('name', 'ชื่อสิทธิ์การใช้งาน');
const descriptionColumn = SortColumn<IRole>('description', 'คำอธิบาย');
const createdByColumn = SortColumn<IRole>('createdBy', 'ผู้แก้ไข', 'center');
const updatedAtColumn = SortColumn<IRole>('updatedAt', 'วันที่แก้ไขล่าสุด', 'center');
const actionColumn = ActionColumn<IRole>('actions', 'จัดการ');

type createColumnsProps = {
  account: Account;
  onOpenDialog: (mode: 'edit' | 'delete', id: string, data: { name: string }) => void;
};
export const createColumns = ({
  account,
  onOpenDialog,
}: createColumnsProps): ColumnDef<IRole>[] => {
  const baseColumns: ColumnDef<IRole>[] = [
    {
      ...nameColumn,
      size: 100,
      cell: ({ row }) => {
        const { name, id } = row.original;
        const viewLink = `/setting/role/${id}`;
        return <LinkTable path={viewLink}>{name || '-'}</LinkTable>;
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
        return (
          <div className="text-center">
            {updatedAt ? new Date(updatedAt).toLocaleDateString() : '-'}
          </div>
        );
      },
    },
  ];

  const canEdit = renderByPermission(account, EModules.ADMIN_ROLE, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_ROLE, 'DELETE');
  if (canEdit && canDelete) {
    return [
      ...baseColumns,
      {
        ...actionColumn,
        cell: ({ row }) => {
          const { id, name } = row.original;

          return (
            <div className="flex justify-center gap-2">
              {canEdit && <ButtonEdit onClick={() => onOpenDialog('edit', id, { name })} />}
              {canDelete && (
                <ButtonDelete
                  onOpenDialog={(id, data) => {
                    console.log('DELETE CLICKED', { id, data });
                    onOpenDialog('delete', id, data);
                  }}
                  id={id}
                  data={{ name }}
                />
              )}
            </div>
          );
        },
      },
    ];
  }
  return baseColumns;
};
