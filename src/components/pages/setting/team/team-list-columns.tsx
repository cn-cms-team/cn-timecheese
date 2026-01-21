'use client';
import { ColumnDef } from '@tanstack/react-table';
import {
  ActionColumn,
  ButtonDelete,
  ButtonEdit,
  SortColumn,
} from '@/components/ui/custom/data-table';
import { ITeam } from '@/types/setting/team';
import LinkTable from '@/components/ui/custom/data-table/link';
import BadgeTable from '@/components/ui/custom/data-table/badge';
import { Account } from '@/components/context/app-context';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';

const nameColumn = SortColumn<ITeam>('name', 'ชื่อทีม');
const descriptionColumn = SortColumn<ITeam>('description', 'คำอธิบาย');
const usedCountColumn = SortColumn<ITeam>('used_count', 'จำนวนผู้ใช้งาน', 'center');
const activeColumn = SortColumn<ITeam>('is_active', 'สถานะ', 'center');
const actionColumn = ActionColumn<ITeam>('actions', 'จัดการ');
type createColumnsProps = {
  account: Account;
  onOpenDialog: (mode: 'edit' | 'delete', id: string, team: { name: string }) => void;
};

export const createColumns = ({
  account,
  onOpenDialog,
}: createColumnsProps): ColumnDef<ITeam>[] => {
  const baseColumns: ColumnDef<ITeam>[] = [
    {
      ...nameColumn,
      size: 200,
      cell: ({ row }) => {
        const { name, id } = row.original;
        const viewLink = `/setting/team/${id}`;
        return <LinkTable path={viewLink}>{name}</LinkTable>;
      },
    },
    {
      ...descriptionColumn,
      size: 300,
      cell: ({ row }) => {
        const { description } = row.original;
        return <div>{description || '-'}</div>;
      },
    },
    {
      ...usedCountColumn,
      size: 100,
      cell: ({ row }) => {
        const { used_count } = row.original;
        return <div className="text-center">{used_count || '-'}</div>;
      },
    },
    {
      ...activeColumn,
      cell: ({ row }) => {
        const { is_active } = row.original;
        return (
          <div className="text-center">
            {is_active ? (
              <BadgeTable text="ใช้งาน" type="activate" />
            ) : (
              <BadgeTable text="ไม่ใช้งาน" type="deactivate" />
            )}
          </div>
        );
      },
    },
  ];

  const canEdit = renderByPermission(account, EModules.ADMIN_TEAM, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_TEAM, 'DELETE');
  if (canEdit || canDelete) {
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
                  onOpenDialog={() => onOpenDialog('delete', id, { name })}
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
