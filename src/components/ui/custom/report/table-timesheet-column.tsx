'use client';
import { ColumnDef } from '@tanstack/react-table';

import { SortColumn } from '../data-table';
import { ITimeSheetTable } from '@/types/report';
import { buddhistFormatDate, formatDate } from '@/lib/functions/date-format';
import { FEELING_OPTIONS } from '@/lib/constants/timesheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ColumnTooltip from '../data-table/column-tooltip';
import { Check, House, Clock } from 'lucide-react';
import { Feeling } from '@generated/prisma/enums';

type createColumnsProps = {
  data: any;
};

const dateColumn = SortColumn<ITimeSheetTable>('stamp_date', 'วันที่');
const startTimeColumn = SortColumn<ITimeSheetTable>('start_date', 'เวลาเริ่มต้น');
const endTimeColumn = SortColumn<ITimeSheetTable>('end_date', 'เวลาสิ้นสุด');
const breakDurationColumn = SortColumn<ITimeSheetTable>('exclude_seconds', 'ช่วงพัก');
const totalTrackedColumn = SortColumn<ITimeSheetTable>('summary_seconds', 'รวมเวลา');
const taskTypeColumn = SortColumn<ITimeSheetTable>('task_type_name', 'ประเภทงาน');
const feelingColumn = SortColumn<ITimeSheetTable>('feeling', 'ความรู้สึกต่องาน');
const detailColumn = SortColumn<ITimeSheetTable>('detail', 'รายละเอียดงาน');
const remarkColumn = SortColumn<ITimeSheetTable>('remark', 'ปัญหาและข้อเสนอแนะ');
const workFromHomeColumn = SortColumn<ITimeSheetTable>('is_work_from_home', 'ทำงานจากบ้าน');
const approvedColumn = SortColumn<ITimeSheetTable>('is_approved', 'อนุมัติ');
const DEFAULT_FEELING = Feeling.NEUTRAL;

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
      ...workFromHomeColumn,
      size: 150,
      cell: ({ row }) => {
        const { is_work_from_home } = row.original;
        return (
          <div>
            {is_work_from_home ? <House className="size-4" aria-label="ทำงานจากบ้าน" /> : '-'}
          </div>
        );
      },
    },
    {
      ...startTimeColumn,
      size: 150,
      cell: ({ row }) => {
        const { start_time } = row.original;
        const time = start_time ? formatDate(start_time, 'HH:ii') : '-';
        return <div>{time}</div>;
      },
    },
    {
      ...endTimeColumn,
      size: 150,
      cell: ({ row }) => {
        const { end_time } = row.original;
        const time = end_time ? formatDate(end_time, 'HH:ii') : '-';
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

        return <ColumnTooltip>{detail || '-'}</ColumnTooltip>;
      },
    },
    {
      ...remarkColumn,
      size: 300,
      cell: ({ row }) => {
        const { remark } = row.original;

        return <ColumnTooltip>{remark || '-'}</ColumnTooltip>;
      },
    },
    {
      ...feelingColumn,
      size: 180,
      cell: ({ row }) => {
        const { feeling } = row.original;
        const feelingMeta =
          FEELING_OPTIONS.find((option) => option.value === (feeling ?? DEFAULT_FEELING)) ??
          FEELING_OPTIONS.find((option) => option.value === DEFAULT_FEELING);

        if (!feelingMeta) {
          return <div>-</div>;
        }

        return (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  {feelingMeta.emoji} {feelingMeta.label}
                </span>
              </TooltipTrigger>
              <TooltipContent>{feelingMeta.tooltip}</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      ...approvedColumn,
      size: 50,
      cell: ({ row }) => {
        const { is_approved } = row.original;
        return (
          <div>
            {is_approved ? (
              <Check className="size-4 text-green-600" aria-label="อนุมัติ" />
            ) : (
              <Clock className="size-4 text-gray-400" aria-label="รออนุมัติ" />
            )}
          </div>
        );
      },
    },
  ];

  return baseColumns;
};
