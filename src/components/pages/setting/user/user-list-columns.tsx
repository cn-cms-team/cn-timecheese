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

const nameColumn = SortColumn<IUser>('fullName', 'ชื่อ - นามสกุล');
const nickNameColumn = SortColumn<IUser>('nickName', 'ชื่อเล่น');
const teamColumn = SortColumn<IUser>('team', 'ทีม');
const positionColumn = SortColumn<IUser>('role', 'ตำแหน่ง');
const emailColumn = SortColumn<IUser>('email', 'อีเมล');
const salaryColumn = SortColumn<IUser>('salary_range', 'ช่วงเงินเดือน');
const activeColumn = SortColumn<IUser>('is_active', 'สถานะ');
const actionColumn = ActionColumn<IUser>('actions', 'จัดการ');

type createColumnsProps = {
  onOpenDialog: (
    mode: 'edit' | 'delete',
    isActive: boolean,
    id: string,
    data: { email: string }
  ) => void;
};

export const createColumns = ({ onOpenDialog }: createColumnsProps): ColumnDef<IUser>[] => {
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
      ...salaryColumn,
      cell: ({ row }) => {
        const { salary_range } = row.original;
        return <div>{salary_range || '-'}</div>;
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

    {
      ...actionColumn,
      cell: ({ row }) => {
        const { id, email, is_active } = row.original;

        return (
          <div className="flex justify-center gap-2">
            <ButtonEdit onClick={() => onOpenDialog('edit', is_active, id, { email })} />
            <ButtonDelete
              onOpenDialog={() => onOpenDialog('delete', is_active, id, { email })}
              id={id}
              data={{ email }}
            />
          </div>
        );
      },
    },
  ];
  return baseColumns;
};
