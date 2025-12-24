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

const nameColumn = SortColumn<ITeam>('name', 'ชื่อทีม');
const descriptionColumn = SortColumn<ITeam>('description', 'คำอธิบาย');
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
      ...actionColumn,
      cell: ({ row }) => {
        const { id, name } = row.original;
        const isActive = true;
        return (
          <div className="flex justify-center space-x-1">
            <ButtonEdit onClick={() => onOpenDialog('edit', isActive, id, { name })} />
            <ButtonDelete
              onOpenDialog={() => onOpenDialog('delete', isActive, id, { name })}
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
