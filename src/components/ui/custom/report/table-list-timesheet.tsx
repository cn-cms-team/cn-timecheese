'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ITimeSheetData } from '@/types/report';
import { defaultPageSize } from '@/types/constants/pagination';

import { Input } from '../../input';
import { Label } from '../../label';
import DataTable from '../data-table/table-template';
import { createColumns } from './table-timesheet-column';
import { Button } from '../../button';
import { DatePickerInput } from '../input/date-picker';
import { DateRangePicker } from '../input/date-range-picker';
import { DateRange } from 'react-day-picker';

interface IProps {
  projectId: string;
}

const TableListTimesheet = ({ projectId }: IProps) => {
  const { data: session } = useSession();
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<ITimeSheetData>({
    data: [],
    total_items: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const [tempFilter, setTempFilter] = useState<{
    search: string;
    date: DateRange | undefined;
  }>({
    search: '',
    date: undefined,
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
    if (tempFilter.date?.from) params.append('start_date', tempFilter.date?.from.toISOString());
    if (tempFilter.date?.to) params.append('end_date', tempFilter.date?.to.toISOString());

    try {
      setLoading(true);
      const url = `${prefix}/api/v1/dashboard/worklogs/${userId}?${params.toString()}`;
      const res = await fetch(url);
      const json = (await res.json()) as ITimeSheetData;
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id || !projectId) return;

    fetchData(session.user.id);
  }, [pagination.pageIndex, pagination.pageSize, session?.user?.id, projectId]);

  const table = useReactTable({
    data: data.data,
    columns,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: data ? Math.ceil(data?.total_items / pagination.pageSize) : 0,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="border rounded-md p-3 w-full shadow grid grid-cols-1">
      <div className="text-base font-semibold mb-4">ประวัติการบันทึกเวลา</div>
      <header className="flex flex-col md:flex-row mb-2 items-end gap-2">
        <div className="space-y-1 md:max-w-sm w-full">
          <Label>ค้นหา</Label>
          <Input
            value={tempFilter.search}
            className="max-w-sm"
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
        <div className="space-y-1 md:w-md w-full">
          <Label>วันที่เริ่มต้น - สิ้นสุด</Label>
          <DateRangePicker
            selected={tempFilter.date}
            disabled={loading}
            onSelect={(date) => {
              setTempFilter({ ...tempFilter, date });
            }}
          />
        </div>
        <Button
          className="md:max-w-30 w-full"
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
