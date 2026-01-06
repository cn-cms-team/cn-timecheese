'use client';
import { ColumnDef } from '@tanstack/react-table';

import { SortColumn } from '../data-table';
import { ITimeSheetResponse } from '@/types/timesheet';
import { buddhistFormatDate } from '@/lib/functions/date-format';

type createColumnsProps = {
  data: any;
};

const dateColumn = SortColumn<ITimeSheetResponse>('stamp_date', 'วันที่');
const startTimeColumn = SortColumn<ITimeSheetResponse>('start_date', 'เวลาเริ่มต้น');
const endTimeColumn = SortColumn<ITimeSheetResponse>('end_date', 'เวลาสิ้นสุด');
const breakDurationColumn = SortColumn<ITimeSheetResponse>('exclude_seconds', 'ช่วงพัก');
const totalTrackedColumn = SortColumn<ITimeSheetResponse>('summary_seconds', 'รวมเวลา');
const taskTypeColumn = SortColumn<ITimeSheetResponse>('task_type_name', 'ประเภทงาน');
const detailColumn = SortColumn<ITimeSheetResponse>('detail', 'รายละเอียดงาน');

export const createColumns = ({ data }: createColumnsProps): ColumnDef<ITimeSheetResponse>[] => {
  const baseColumns: ColumnDef<ITimeSheetResponse>[] = [
    {
      ...dateColumn,
      size: 150,
      cell: ({ row }) => {
        const { stamp_date } = row.original;
        return <div>{buddhistFormatDate(stamp_date, 'dd mmm yyyy') || '-'}</div>;
      },
    },
    {
      ...startTimeColumn,
      size: 150,
      cell: ({ row }) => {
        const { start_date } = row.original;
        const time = start_date ? buddhistFormatDate(start_date, 'HH:MM') : '-';
        return <div>{buddhistFormatDate(time, 'HH:ii') || '-'}</div>;
      },
    },
    {
      ...endTimeColumn,
      size: 150,
      cell: ({ row }) => {
        const { end_date } = row.original;
        const time = end_date ? buddhistFormatDate(end_date, 'HH:MM') : '-';
        return <div>{buddhistFormatDate(time, 'HH:ii') || '-'}</div>;
      },
    },
    {
      ...breakDurationColumn,
      size: 150,
      cell: ({ row }) => {
        const { exclude_seconds } = row.original;
        const hours = Math.floor(exclude_seconds / 3600);
        const minutes = Math.floor((exclude_seconds % 3600) / 60);
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
          2,
          '0'
        )}`;
        return <div>{formattedTime || '-'}</div>;
      },
    },
    {
      ...totalTrackedColumn,
      size: 150,
      cell: ({ row }) => {
        const { start_date, end_date, exclude_seconds } = row.original;

        const startTime = start_date ? new Date(start_date).getTime() : 0;
        const endTime = end_date ? new Date(end_date).getTime() : 0;
        const totalSeconds =
          startTime && endTime ? Math.floor((endTime - startTime) / 1000) - exclude_seconds : 0;

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
          2,
          '0'
        )}`;
        return <div>{formattedTime || '-'}</div>;
      },
    },
    {
      ...taskTypeColumn,
      size: 200,
      cell: ({ row }) => {
        const { task_type_name } = row.original;
        return <div>{task_type_name || '-'}</div>;
      },
    },
    {
      ...detailColumn,
      size: 300,
      cell: ({ row }) => {
        const { detail } = row.original;
        return <div>{detail || '-'}</div>;
      },
    },
  ];

  return baseColumns;
};
