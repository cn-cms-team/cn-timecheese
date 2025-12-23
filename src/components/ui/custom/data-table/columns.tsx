import { ColumnDef, SortingFnOption } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function SelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function SortColumn<TData>(
  accessorKey: string,
  columnName: string,
  align: string = 'left',
  sortable: boolean = false,
  size?: number,
  sortingFn: SortingFnOption<TData> = 'customSort' as SortingFnOption<TData>
): ColumnDef<TData> {
  return {
    accessorKey,
    sortingFn,
    header: ({ column }) => {
      let positionClass = '';
      switch (align) {
        case 'center':
          positionClass = 'justify-center';
          break;
        case 'right':
          positionClass = 'justify-end';
          break;
        default:
          positionClass = 'justify-start';
          break;
      }
      const fullClass = `flex ${positionClass} cursor-pointer select-none`;
      return (
        <div
          className={fullClass}
          onClick={() =>
            sortable ? column.toggleSorting(column.getIsSorted() === 'asc') : undefined
          }
        >
          {columnName}
          {sortable && (
            <div className="h-4 w-3 ms-3 relative">
              <ChevronUp
                className={`absolute top-0 h-3 w-3 ${
                  column.getIsSorted() === 'asc' ? '' : 'text-[#98A2B3]'
                }`}
              />
              <ChevronDown
                className={`absolute top-2 h-3 w-3 ${
                  column.getIsSorted() === 'desc' ? '' : 'text-[#98A2B3]'
                }`}
              />
            </div>
          )}
        </div>
      );
    },
    size,
    minSize: 100,
    maxSize: 300,
  };
}

export function ActionColumn<TData>(
  accessorKey: string,
  columnName: string,
  size = 80
): ColumnDef<TData> {
  return {
    accessorKey,
    header: () => {
      const fullClass = `flex justify-center cursor-pointer`;
      return <div className={fullClass}>{columnName}</div>;
    },
    size,
    minSize: 64,
    maxSize: 128,
  };
}
