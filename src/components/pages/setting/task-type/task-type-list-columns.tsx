'use client';
import { ColumnDef } from '@tanstack/react-table';

import { SortColumn, ActionColumn, ButtonEdit } from '@/components/ui/custom/data-table';
import { ITaskMenu } from '@/types/setting/task-type';
import LinkTable from '@/components/ui/custom/data-table/link';
import { EModules } from '@/lib/constants/module';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { Account } from '@/components/context/app-context';

const nameColumn = SortColumn<ITaskMenu>('name', 'ชื่อ');
const descriptionColumn = SortColumn<ITaskMenu>('description', 'คำอธิบาย');
const actionColumn = ActionColumn<ITaskMenu>('actions', 'จัดการ');

type createColumnsProps = {
  account: Account;
  onOpenDialog: (mode: 'edit', id: string, data: { name: string }) => void;
};

export const createColumns = ({
  account,
  onOpenDialog,
}: createColumnsProps): ColumnDef<ITaskMenu>[] => {
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
  ];

  const canEdit = renderByPermission(account, EModules.ADMIN_TASK_TYPE, 'EDIT');
  if (canEdit) {
    return [
      ...baseColumns,
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
  }
  return baseColumns;
};
