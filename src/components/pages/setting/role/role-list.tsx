'use client';

import { InputSearch } from '@/components/ui/custom/data-table';
import DataTable from '@/components/ui/custom/data-table/table-template';
import { Label } from '@/components/ui/label';
import {
  createBooleanSortFn,
  createCustomSortFn,
  createNullsLastSortFn,
} from '@/lib/functions/sort-utils';
import { IRole } from '@/types/setting/role';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function RoleList<TData, TValue>({ columns, data, loading }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'email', desc: false }]);
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
    filterValue: { search: string }
  ) => {
    const search = filterValue.search.toLowerCase().trim();
    const { name } = row.original as IRole;
    const searchMatch = name?.toLowerCase().includes(search);

    return searchMatch;
  };
  const table = useReactTable({
    data,
    columns,
    sortingFns: {
      dateSort: createNullsLastSortFn<IRole>(sorting),
      customSort: createCustomSortFn<IRole>(),
      booleanSort: createBooleanSortFn<IRole>(),
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
            placeholder="ชื่อสิทธิ์การใช้งาน"
            globalFilter={tempFilter.search}
            setGlobalFilter={(value: string) =>
              setTempFilter((prev) => ({ ...prev, search: value }))
            }
            onEnter={handleSearch}
          />
        </div>
      </div>
      <DataTable table={table} columns={columns} loading={loading} />
    </div>
  );
}
