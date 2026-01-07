'use client';
import React, { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  createBooleanSortFn,
  createCustomSortFn,
  createNullsLastSortFn,
} from '@/lib/functions/sort-utils';
import { ITimeSheetTable } from '@/types/report';

import { Input } from '../../input';
import { Label } from '../../label';
import Dropdown from '../input/dropdown';
import DataTable from '../data-table/table-template';
import { createColumns } from './table-timesheet-column';

const TableListTimesheet = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
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

  const columns = createColumns({
    data: [],
  });

  const multiColumnGlobalFilter = (
    row: Row<ITimeSheetTable>,
    columnId: string,
    filterValue: {}
  ) => {
    return false;
  };

  const table = useReactTable({
    data: [],
    columns,
    sortingFns: {
      dateSort: createNullsLastSortFn<any>(sorting),
      customSort: createCustomSortFn<any>(),
      booleanSort: createBooleanSortFn<any>(),
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
    <div className="border rounded-md p-3 w-full">
      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 mb-3">
        <div className="space-y-1 w-full">
          <Label>ค้นหา</Label>
          <Input className="w-full" placeholder="ค้นหา" />
        </div>
        <div className="space-y-1 w-full">
          <Label>วันที่</Label>
          <Dropdown options={[]} className="w-full" placeholder="เลือกวันที่" />
        </div>
      </header>
      <DataTable table={table} columns={columns} />
    </div>
  );
};
export default React.memo(TableListTimesheet);
