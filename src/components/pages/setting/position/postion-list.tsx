'use client';
import { useState } from 'react';

import {
  createNullsLastSortFn,
  createCustomSortFn,
  createBooleanSortFn,
} from '@/lib/functions/sort-utils';

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
import { Label } from '@/components/ui/label';
import DataTable from '@/components/ui/custom/data-table/table-template';
import InputSearch from '@/components/ui/custom/data-table/input/input-search';
import SearchButton from '@/components/ui/custom/button/search-button';
import { IPosition } from '@/types/setting/position';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function PositionList<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
  }>({
    search: '',
  });

  const [tempFilter, setTempFilter] = useState<{
    search: string;
  }>({
    search: '',
  });

  const handleSearch = () => {
    setGlobalFilter({ ...tempFilter });
  };

  const multiColumnGlobalFilter = (
    row: Row<TData>,
    columnId: string,
    filterValue: { search: string; positionType: string }
  ) => {
    const search = filterValue.search.toLowerCase().trim();
    const { name, description } = row.original as IPosition;
    const descriptionValue = description || '';
    const searchMatch =
      name?.toLowerCase().includes(search) || descriptionValue?.toLowerCase().includes(search);

    return searchMatch;
  };

  const table = useReactTable({
    data,
    columns,
    sortingFns: {
      dateSort: createNullsLastSortFn<IPosition>(sorting),
      customSort: createCustomSortFn<IPosition>(),
      booleanSort: createBooleanSortFn<IPosition>(),
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
          <Label className="mb-2">ค้นหา</Label>
          <InputSearch
            isMaxWidthSm={false}
            placeholder="ชื่อตำแหน่ง, คำอธิบาย"
            globalFilter={tempFilter.search}
            setGlobalFilter={(value: string) =>
              setTempFilter((prev) => ({ ...prev, search: value }))
            }
            onEnter={handleSearch}
          />
        </div>
      </div>
      <DataTable table={table} columns={columns} />
    </div>
  );
}
