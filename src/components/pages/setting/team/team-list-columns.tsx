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

const nameColumn = SortColumn<ITeam>('name', 'ชื่อทีม');
const descriptionColumn = SortColumn<ITeam>('description', 'คำอธิบาย');
const activeColumn = SortColumn<ITeam>('is_active', 'สถานะ');
const actionColumn = ActionColumn<ITeam>('actions', 'จัดการ');
type createColumnsProps = {
  onOpenDialog: (
    mode: 'edit' | 'delete',
    isActive: boolean,
    id: string,
    team: { name: string }
  ) => void;
};

export const createColumns = ({ onOpenDialog }: createColumnsProps): ColumnDef<ITeam>[] => {
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
        const { id, name, is_active } = row.original;
        return (
          <div className="flex justify-center space-x-1">
            <ButtonEdit onClick={() => onOpenDialog('edit', is_active, id, { name })} />
            <ButtonDelete
              onOpenDialog={() => onOpenDialog('delete', is_active, id, { name })}
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
