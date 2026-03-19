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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IUser } from '@/types/setting/user';
import { IProject } from '@/types/setting/project';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function ProjectList<TData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
    projectType: string;
  }>({
    search: '',
    projectType: 'unspecified',
  });

  const [tempFilter, setTempFilter] = useState<{
    search: string;
    projectType: string;
  }>({
    search: '',
    projectType: 'unspecified',
  });

  const handleSearch = () => {
    setGlobalFilter({ ...tempFilter });
  };

  const multiColumnGlobalFilter = (
    row: Row<TData>,
    _columnId: string,
    filterValue: { search: string; projectType: string }
  ) => {
    const search = filterValue.search.toLowerCase().trim();
    const { name, code, is_company_project } = row.original as IProject;
    const searchMatch =
      name?.toLowerCase().includes(search) || code?.toLowerCase().includes(search);

    const projectTypeMatch =
      filterValue.projectType === 'unspecified' ||
      (filterValue.projectType === 'company' && is_company_project) ||
      (filterValue.projectType === 'customer' && !is_company_project);

    return searchMatch && projectTypeMatch;
  };

  const table = useReactTable({
    data,
    columns,
    sortingFns: {
      dateSort: createNullsLastSortFn<IUser>(sorting),
      customSort: createCustomSortFn<IUser>(),
      booleanSort: createBooleanSortFn<IUser>(),
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
      <div className="grid grid-cols-1 md:grid-cols-3 items-end pb-4 gap-4">
        <div className="w-full md:col-span-2">
          <Label className="mb-2 block">ค้นหา</Label>
          <InputSearch
            isMaxWidthSm={false}
            placeholder="ชื่อโครงการ, รหัสโครงการ"
            globalFilter={tempFilter.search}
            setGlobalFilter={(value: string) =>
              setTempFilter((prev) => ({ ...prev, search: value }))
            }
            onEnter={handleSearch}
          />
        </div>
        <div className="w-full md:col-span-1">
          <Label className="mb-2 block">ประเภทโครงการ</Label>
          <Select
            value={tempFilter.projectType}
            onValueChange={(value) => {
              setTempFilter((prev) => ({ ...prev, projectType: value }));
              setGlobalFilter((prev) => ({ ...prev, projectType: value }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ไม่ระบุ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unspecified">ไม่ระบุ</SelectItem>
              <SelectItem value="company">โครงการภายในบริษัท</SelectItem>
              <SelectItem value="customer">โครงการลูกค้า</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable table={table} columns={columns} loading={loading} />
    </div>
  );
}
