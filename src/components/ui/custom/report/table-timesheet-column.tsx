'use client';
import { ColumnDef } from '@tanstack/react-table';

import { SortColumn } from '../data-table';
import { ITimeSheetTable } from '@/types/report';
import { buddhistFormatDate } from '@/lib/functions/date-format';

type createColumnsProps = {
  data: any;
};

const dateColumn = SortColumn<ITimeSheetTable>('stamp_date', 'วันที่');
const startTimeColumn = SortColumn<ITimeSheetTable>('start_date', 'เวลาเริ่มต้น');
const endTimeColumn = SortColumn<ITimeSheetTable>('end_date', 'เวลาสิ้นสุด');
const breakDurationColumn = SortColumn<ITimeSheetTable>('exclude_seconds', 'ช่วงพัก');
const totalTrackedColumn = SortColumn<ITimeSheetTable>('summary_seconds', 'รวมเวลา');
const taskTypeColumn = SortColumn<ITimeSheetTable>('task_type_name', 'ประเภทงาน');
const detailColumn = SortColumn<ITimeSheetTable>('detail', 'รายละเอียดงาน');

export const createColumns = ({ data }: createColumnsProps): ColumnDef<ITimeSheetTable>[] => {
  const baseColumns: ColumnDef<ITimeSheetTable>[] = [
    {
      ...dateColumn,
      size: 150,
      cell: ({ row }) => {
        const { date } = row.original;
        return <div>{buddhistFormatDate(date, 'dd mmm yyyy') || '-'}</div>;
      },
    },
    {
      ...startTimeColumn,
      size: 150,
      cell: ({ row }) => {
        const { start_time } = row.original;
        const time = start_time ? buddhistFormatDate(start_time, 'HH:ii') : '-';
        return <div>{time}</div>;
      },
    },
    {
      ...endTimeColumn,
      size: 150,
      cell: ({ row }) => {
        const { end_time } = row.original;
        const time = end_time ? buddhistFormatDate(end_time, 'HH:ii') : '-';
        return <div>{time}</div>;
      },
    },
    {
      ...breakDurationColumn,
      size: 150,
      cell: ({ row }) => {
        const { break_hours } = row.original;
        const hours = Math.floor(break_hours / 3600);
        const minutes = Math.floor((break_hours % 3600) / 60);
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
        const { start_time, end_time, break_hours } = row.original;

        const startTime = start_time ? new Date(start_time).getTime() : 0;
        const endTime = end_time ? new Date(end_time).getTime() : 0;
        const totalSeconds =
          startTime && endTime ? Math.floor((endTime - startTime) / 1000) - break_hours : 0;

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
        const { task_type } = row.original;
        return <div>{task_type || '-'}</div>;
      },
    },
    {
      ...detailColumn,
      size: 300,
      cell: ({ row }) => {
        const { detail } = row.original;
        return <div className="truncate w-80">{detail || '-'}</div>;
      },
    },
  ];

  return baseColumns;
};
