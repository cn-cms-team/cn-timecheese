import { BriefcaseBusiness, Clock3, Pencil, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { toneClasses } from '@/lib/constants/timesheet';
import type { TimelineItem } from '@/types/timesheet';

type TimelineListProps = {
  timelineItems: TimelineItem[];
};

const TimelineList = ({ timelineItems }: TimelineListProps) => {
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
        const tone = toneClasses[item.tone];

        return (
          <div
            className="grid grid-cols-[68px_16px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[88px_20px_minmax(0,1fr)] sm:gap-4"
            key={item.id}
          >
            <div className="pt-2 text-right z-10">
              <p className="text-xl leading-none font-bold text-slate-900 sm:text-3xl">
                {item.startTime}
              </p>
              <p className="mt-2 text-xs text-slate-400 sm:text-sm">{item.durationLabel}</p>
            </div>

            <div className="flex justify-center pt-3">
              <span className="size-3 rounded-full border-3 border-slate-300 bg-white sm:size-4" />
            </div>

            <article className={cn('rounded-3xl border p-4 sm:p-6', tone.panel)}>
              <div className="flex items-start justify-between gap-3">
                <h3 className={cn('text-xl font-bold wrap-break-word sm:text-3xl', tone.text)}>
                  {item.title}
                </h3>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    aria-label={`แก้ไขกิจกรรม ${item.title}`}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-white sm:px-3 sm:text-sm"
                    type="button"
                  >
                    <Pencil className="size-3.5 sm:size-4" />
                    แก้ไข
                  </button>

                  <button
                    aria-label={`ลบกิจกรรม ${item.title}`}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50/80 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 sm:px-3 sm:text-sm"
                    type="button"
                  >
                    <Trash2 className="size-3.5 sm:size-4" />
                    ลบ
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-slate-700 sm:text-base">
                {item.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm sm:gap-3 sm:text-xl">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold sm:gap-2 sm:px-3',
                    tone.badge
                  )}
                >
                  <BriefcaseBusiness className="size-3 sm:size-4" />
                  {item.category}
                </span>

                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-1 sm:gap-2 sm:px-3',
                    tone.badge
                  )}
                >
                  <Clock3 className="size-3 sm:size-4" />
                  {item.startTime} - {item.endTime}
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
