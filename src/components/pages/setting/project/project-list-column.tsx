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
import { Account } from '@/components/context/app-context';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';

const nameColumn = SortColumn<IProject>('name', 'ชื่อโครงการ');
const codeColumn = SortColumn<IProject>('code', 'รหัสโครงการ');
const startDateColumn = SortColumn<IProject>('start_date', 'วันที่เริ่มต้น');
const endDateColumn = SortColumn<IProject>('end_date', 'วันที่สิ้นสุด');
const actionColumn = ActionColumn<IProject>('actions', 'จัดการ');

type createColumnsProps = {
  account: Account;
  onOpenDialog: (mode: 'edit' | 'delete', id: string, code: string) => void;
};

export const createColumns = ({
  account,
  onOpenDialog,
}: createColumnsProps): ColumnDef<IProject>[] => {
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
  ];

  const canEdit = renderByPermission(account, EModules.ADMIN_PROJECT, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_PROJECT, 'DELETE');
  if (canEdit && canDelete) {
    return [
      ...baseColumns,
      {
        ...actionColumn,
        cell: ({ row }) => {
          const { id, code, is_using } = row.original;
          return (
            <div className="flex justify-center gap-2">
              {canEdit && <ButtonEdit onClick={() => onOpenDialog('edit', id, code ?? '')} />}
              {canDelete && (
                <ButtonDelete
                  onOpenDialog={() => onOpenDialog('delete', id, code ?? '')}
                  id={id}
                  data={{ code }}
                  disabled={is_using}
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
