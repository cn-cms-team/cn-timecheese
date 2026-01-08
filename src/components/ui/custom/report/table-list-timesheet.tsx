'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
import DataTable from '../data-table/table-template';
import { createColumns } from './table-timesheet-column';
import { Button } from '../../button';
import { DatePickerInput } from '../input/date-picker';

interface IProps {
  projectId: string;
}

const TableListTimesheet = ({ projectId }: IProps) => {
  const { data: session } = useSession();
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ITimeSheetTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [tempFilter, setTempFilter] = useState<{
    search: string;
    date: string | null;
  }>({
    search: '',
    date: new Date().toISOString(),
  });

  const columns = createColumns({
    data: [],
  });

  const fetchData = async (userId: string) => {
    const params = new URLSearchParams({
      page: (pagination.pageIndex + 1).toString(),
      limit: pagination.pageSize.toString(),
    });

    if (projectId) params.append('project_id', projectId);
    if (tempFilter.search) params.append('search', tempFilter.search);
    if (tempFilter.date) params.append('date', tempFilter.date);

    try {
      setLoading(true);
      const url = `${prefix}/api/v1/dashboard/worklogs/${userId}?${params.toString()}`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id || !projectId) return;

    fetchData(session.user.id);
  }, [pagination.pageIndex, pagination.pageSize, sorting, session?.user?.id, projectId]);

  const table = useReactTable({
    data,
    columns,
    sortingFns: {
      dateSort: createNullsLastSortFn<any>(sorting),
      customSort: createCustomSortFn<any>(),
      booleanSort: createBooleanSortFn<any>(),
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: data ? Math.ceil(data?.length / pagination.pageSize) : 0,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="border rounded-md p-3 w-full">
      <header className="grid grid-cols-1  lg:grid-cols-4 xl:grid-cols-6 gap-2 mb-3 items-end">
        <div className="space-y-1 w-full">
          <Label>ค้นหา</Label>
          <Input
            value={tempFilter.search}
            className="w-full"
            placeholder="ค้นหา"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchData(session?.user?.id!);
              }
            }}
            onChange={(e) => {
              setTempFilter({ ...tempFilter, search: e.target.value });
            }}
          />
        </div>
        <div className="space-y-1 w-full">
          <Label>วันที่</Label>
          <DatePickerInput
            value={tempFilter.date ? new Date(tempFilter.date) : undefined}
            placeholder="เลือกวันที่"
            disabled={loading}
            onChange={(date) => {
              setTempFilter({ ...tempFilter, date: date?.toISOString() || null });
            }}
          />
        </div>
        <Button
          className="max-w-full lg:max-w-30"
          type="button"
          onClick={() => fetchData(session?.user?.id!)}
          disabled={loading}
        >
          ค้นหา
        </Button>
      </header>
      <DataTable table={table} columns={columns} loading={loading} />
    </div>
  );
};
export default React.memo(TableListTimesheet);
