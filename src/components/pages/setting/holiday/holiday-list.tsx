'use client';

import { useState } from 'react';
import {
  Row,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  createBooleanSortFn,
  createCustomSortFn,
  createNullsLastSortFn,
} from '@/lib/functions/sort-utils';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import DataTable from '@/components/ui/custom/data-table/table-template';
import InputSearch from '@/components/ui/custom/data-table/input/input-search';
import { Label } from '@/components/ui/label';
import { IHoliday } from '@/types/setting/holiday';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function HolidayList<TData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<{ search: string }>({
    search: '',
  });
  const [tempFilter, setTempFilter] = useState<{ search: string }>({
    search: '',
  });

  const handleSearch = () => {
    setGlobalFilter({ ...tempFilter });
  };

  const multiColumnGlobalFilter = (
    row: Row<TData>,
    columnId: string,
    filterValue: { search: string }
  ) => {
    const search = filterValue.search.toLowerCase().trim();
    const { name, description, date } = row.original as IHoliday;

    const dateText = buddhistFormatDate(date, 'dd/MM/yyyy').toLowerCase();
    return (
      dateText.includes(search) ||
      name.toLowerCase().includes(search) ||
      (description || '').toLowerCase().includes(search)
    );
  };

  const table = useReactTable({
    data,
    columns,
    sortingFns: {
      dateSort: createNullsLastSortFn<IHoliday>(sorting),
      customSort: createCustomSortFn<IHoliday>(),
      booleanSort: createBooleanSortFn<IHoliday>(),
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: multiColumnGlobalFilter,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end pb-4 gap-4">
        <div className="w-full h-full ">
          <Label>ค้นหา</Label>
          <InputSearch
            isMaxWidthSm={false}
            placeholder="วันที่, ชื่อวันหยุด, คำอธิบาย"
            globalFilter={tempFilter.search}
            setGlobalFilter={(value: string) =>
              setTempFilter((prev) => ({
                ...prev,
                search: value,
              }))
            }
            onEnter={handleSearch}
          />
        </div>
      </div>
      <DataTable table={table} columns={columns} loading={loading} />
    </div>
  );
}
