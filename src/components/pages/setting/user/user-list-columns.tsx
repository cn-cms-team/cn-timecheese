'use client';
import { ColumnDef } from '@tanstack/react-table';

import {
  SortColumn,
  ActionColumn,
  ButtonEdit,
  ButtonDelete,
} from '@/components/ui/custom/data-table';
import { IUser } from '@/types/setting/user';
import LinkTable from '@/components/ui/custom/data-table/link';
import BadgeTable from '@/components/ui/custom/data-table/badge';
import { EModules } from '@/lib/constants/module';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { Account } from '@/components/context/app-context';

const nameColumn = SortColumn<IUser>('fullName', 'ชื่อ - นามสกุล');
const nickNameColumn = SortColumn<IUser>('nickName', 'ชื่อเล่น');
const teamColumn = SortColumn<IUser>('team', 'ทีม');
const positionColumn = SortColumn<IUser>('role', 'ตำแหน่ง');
const emailColumn = SortColumn<IUser>('email', 'อีเมล');
const activeColumn = SortColumn<IUser>('is_active', 'สถานะ');
const actionColumn = ActionColumn<IUser>('actions', 'จัดการ');

type createColumnsProps = {
  account: Account;
  onOpenDialog: (mode: 'edit' | 'delete', id: string, data: { email: string }) => void;
};

export const createColumns = ({
  account,
  onOpenDialog,
}: createColumnsProps): ColumnDef<IUser>[] => {
  const baseColumns: ColumnDef<IUser>[] = [
    {
      ...nameColumn,
      cell: ({ row }) => {
        const { first_name, last_name, id } = row.original;
        const fullName = [first_name, last_name].join(' ').trim();
        const viewLink = `/setting/user/${id}`;
        return <LinkTable path={viewLink}>{fullName}</LinkTable>;
      },
    },
    {
      ...nickNameColumn,

      cell: ({ row }) => {
        const { nick_name } = row.original;
        return <div>{nick_name || '-'}</div>;
      },
    },
    {
      ...teamColumn,

      cell: ({ row }) => {
        const { team } = row.original;
        return <div>{team?.name || '-'}</div>;
      },
    },
    {
      ...positionColumn,

      cell: ({ row }) => {
        const { position_level } = row.original;
        return <div>{position_level?.name || '-'}</div>;
      },
    },
    {
      ...emailColumn,
      cell: ({ row }) => {
        const { email } = row.original;
        return <div>{email || '-'}</div>;
      },
    },
    {
      ...activeColumn,
      cell: ({ row }) => {
        const { is_active } = row.original;
        return (
          <div>
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

  const canEdit = renderByPermission(account, EModules.ADMIN_USER, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_USER, 'DELETE');
  if (canEdit || canDelete) {
    return [
      ...baseColumns,
      {
        ...actionColumn,
        cell: ({ row }) => {
          const { id, email } = row.original;

          return (
            <div className="flex justify-center gap-2">
              {canEdit && <ButtonEdit onClick={() => onOpenDialog('edit', id, { email })} />}
              {canDelete && (
                <ButtonDelete
                  onOpenDialog={() => onOpenDialog('delete', id, { email })}
                  id={id}
                  data={{ email }}
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
