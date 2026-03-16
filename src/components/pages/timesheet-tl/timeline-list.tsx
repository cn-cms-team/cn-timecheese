import { BriefcaseBusiness, Clock3, Pencil, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { toneClasses } from '@/lib/constants/timesheet';
import { Skeleton } from '@/components/ui/skeleton';
import type { TimelineItem } from '@/types/timesheet';

type TimelineListProps = {
  timelineItems: TimelineItem[];
  isLoading?: boolean;
  onEditItem?: (item: TimelineItem) => void;
  onDeleteItem?: (item: TimelineItem) => void;
  deletingItemId?: string | null;
};

const formatTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatDurationLabel = (seconds: number) => {
  const hours = seconds / 3600;
  if (!hours) {
    return '0 ชม.';
  }

  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} ชม.`;
};

const formatBreakDurationLabel = (seconds: number) => {
  if (seconds <= 0) {
    return '0 นาที';
  }

  if (seconds < 3600) {
    return `${Math.round(seconds / 60)} นาที`;
  }

  const hours = seconds / 3600;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} ชม.`;
};

const TimelineList = ({
  timelineItems,
  isLoading = false,
  onEditItem,
  onDeleteItem,
  deletingItemId,
}: TimelineListProps) => {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="grid grid-cols-[68px_16px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[88px_20px_minmax(0,1fr)] sm:gap-4"
            key={`timeline-skeleton-${index}`}
          >
            <div className="pt-2 text-right z-10">
              <Skeleton className="ml-auto h-8 w-14 sm:h-10 sm:w-18" />
              <Skeleton className="mt-2 ml-auto h-4 w-10 sm:w-12" />
            </div>

            <div className="flex justify-center pt-3">
              <span className="size-3 rounded-full border-3 border-slate-300 bg-white sm:size-4" />
            </div>

            <article className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-7 w-42 sm:h-10 sm:w-56" />
                <div className="flex shrink-0 items-center gap-2">
                  <Skeleton className="h-8 w-16 rounded-full sm:h-9 sm:w-20" />
                  <Skeleton className="h-8 w-16 rounded-full sm:h-9 sm:w-20" />
                </div>
              </div>

              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />

              <div className="mt-3 flex items-center gap-2 sm:gap-3">
                <Skeleton className="h-7 w-30 rounded-full sm:h-9 sm:w-36" />
                <Skeleton className="h-7 w-36 rounded-full sm:h-9 sm:w-44" />
              </div>
            </article>
          </div>
        ))}
      </>
    );
  }

  if (timelineItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
        ไม่มีรายการกิจกรรมสำหรับวันที่เลือก
      </div>
    );
  }

  return (
    <>
      {timelineItems.map((item) => {
        const tone = toneClasses[item.tone ?? 'blue'];
        const startTime = formatTime(item.start_date);
        const endTime = formatTime(item.end_date);
        const isDeleting = deletingItemId === item.id;

        return (
          <div
            className="grid grid-cols-[68px_16px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[88px_20px_minmax(0,1fr)] sm:gap-4"
            key={item.id}
          >
            <div className="pt-2 text-right z-10">
              <p className="text-xl leading-none font-bold text-slate-900 sm:text-3xl">
                {startTime}
              </p>
              <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                {formatDurationLabel(item.total_seconds)}
              </p>
            </div>

            <div className="flex justify-center pt-3">
              <span className="size-3 rounded-full border-3 border-slate-300 bg-white sm:size-4" />
            </div>

            <article className={cn('rounded-3xl border p-4 sm:p-6', tone.panel)}>
              <div className="flex items-start justify-between gap-3">
                <h3 className={cn('text-xl font-bold wrap-break-word sm:text-2xl', tone.text)}>
                  {item.project_name}
                </h3>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    aria-label={`แก้ไขกิจกรรม ${item.project_name}`}
                    className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-white sm:px-3 sm:text-sm"
                    onClick={() => onEditItem?.(item)}
                    type="button"
                  >
                    <Pencil className="size-3.5 sm:size-4" />
                    แก้ไข
                  </button>

                  <button
                    aria-label={`ลบกิจกรรม ${item.project_name}`}
                    className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/80 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm"
                    disabled={isDeleting}
                    onClick={() => onDeleteItem?.(item)}
                    type="button"
                  >
                    <Trash2 className="size-3.5 sm:size-4" />
                    {isDeleting ? 'กำลังลบ...' : 'ลบ'}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-slate-700 sm:text-base">
                {item.detail}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm sm:gap-3 sm:text-base">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold sm:gap-2 sm:px-3',
                    tone.badge
                  )}
                >
                  <BriefcaseBusiness className="size-3 sm:size-4" />
                  {item.task_type_name ?? '-'}
                </span>

                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2 py-1 sm:gap-2 sm:px-3',
                    tone.badge
                  )}
                >
                  <Clock3 className="size-3 sm:size-4" />
                  {startTime} - {endTime}
                </span>

                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2 py-1 sm:gap-2 sm:px-3',
                    tone.badge
                  )}
                >
                  เวลาพักรวม {formatBreakDurationLabel(item.exclude_seconds)}
                </span>
              </div>
            </article>
          </div>
        );
      })}
    </>
  );
};

export default TimelineList;
