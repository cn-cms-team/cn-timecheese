'use client';
import { ColumnDef } from '@tanstack/react-table';
import { SortColumn } from '@/components/ui/custom/data-table';
import { IPositionLevel } from '@/types/setting/position';

const levelColumn = SortColumn<IPositionLevel>('ord', 'ระดับ', 'start', false, 10);
const positionNameColumn = SortColumn<IPositionLevel>('name', 'ชื่อตำแหน่ง');
const descriptionColumn = SortColumn<IPositionLevel>('description', 'คำอธิบาย');

export const createLevelListColumns = (): ColumnDef<IPositionLevel>[] => {
  const baseColumns: ColumnDef<IPositionLevel>[] = [
    {
      ...levelColumn,
      cell: ({ row }) => {
        const { ord } = row.original;

        return <div>{ord}</div>;
      },
    },
    {
      ...positionNameColumn,
      size: 200,
      cell: ({ row }) => {
        const { name } = row.original;
        return <div>{name}</div>;
      },
    },
    {
      ...descriptionColumn,
      size: 300,
      cell: ({ row }) => {
        const description = (row.original.description as string) || '-';

        return <div className="whitespace-break-spaces">{description}</div>;
      },
    },
  ];

  return baseColumns;
};
