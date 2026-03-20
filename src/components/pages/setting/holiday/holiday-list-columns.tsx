'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  ActionColumn,
  ButtonDelete,
  ButtonEdit,
  SortColumn,
} from '@/components/ui/custom/data-table';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { IHoliday } from '@/types/setting/holiday';

const dateColumn = SortColumn<IHoliday>('date', 'วันที่', 'left', true);
const nameColumn = SortColumn<IHoliday>('name', 'ชื่อวันหยุด', 'left', true);
const descriptionColumn = SortColumn<IHoliday>('description', 'คำอธิบาย', 'left', true);
const actionColumn = ActionColumn<IHoliday>('actions', 'จัดการ');

type CreateColumnsProps = {
  canEdit: boolean;
  canDelete: boolean;
  onOpenDialog: (
    mode: 'edit' | 'delete',
    id: string,
    data: { name: string; date: Date; description?: string | null }
  ) => void;
};

export const createColumns = ({
  canEdit,
  canDelete,
  onOpenDialog,
}: CreateColumnsProps): ColumnDef<IHoliday>[] => {
  const baseColumns: ColumnDef<IHoliday>[] = [
    {
      ...dateColumn,
      cell: ({ row }) => {
        return <div>{buddhistFormatDate(row.original.date, 'dd mmm yyyy')}</div>;
      },
    },
    {
      ...nameColumn,
      cell: ({ row }) => {
        return <div>{row.original.name || '-'}</div>;
      },
    },
    {
      ...descriptionColumn,
      cell: ({ row }) => {
        return <div>{row.original.description || '-'}</div>;
      },
    },
  ];

  if (canEdit || canDelete) {
    return [
      ...baseColumns,
      {
        ...actionColumn,
        cell: ({ row }) => {
          const { id, name, date, description } = row.original;

          return (
            <div className="flex justify-center gap-2">
              {canEdit && (
                <ButtonEdit onClick={() => onOpenDialog('edit', id, { name, date, description })} />
              )}
              {canDelete && (
                <ButtonDelete
                  onOpenDialog={() => onOpenDialog('delete', id, { name, date, description })}
                  id={id}
                  data={{ name, date, description }}
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
