'use client';

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Clock3, Plus } from 'lucide-react';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DayItem = {
  id: string;
  dayLabel: string;
  date: number;
  totalHours: number;
};

type TimelineCardTone = 'blue' | 'violet' | 'slate' | 'green';

type TimelineItem = {
  id: string;
  dayId: DayItem['id'];
  startTime: string;
  endTime: string;
  durationLabel: string;
  title: string;
  category: string;
  tone: TimelineCardTone;
};

const MONTH_LABEL = 'มีนาคม 2569';

const MOCK_MONTH_YEAR = 2026;
const MOCK_MONTH_INDEX = 3;
const DEFAULT_SELECTED_DAY_ID = '2026-03-10';

const DAY_LABELS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

const HOURS_BY_DAY: Record<number, number> = {
  3: 6,
  4: 7.5,
  5: 8,
  6: 7,
  10: 7.5,
  11: 8,
  12: 6.5,
  13: 7,
  17: 8,
  18: 8,
  19: 7,
  20: 6,
  24: 8,
  25: 7.5,
  26: 8,
  27: 6.5,
  31: 5,
};

const getDayId = (year: number, month: number, date: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

const DAYS: DayItem[] = Array.from(
  { length: new Date(MOCK_MONTH_YEAR, MOCK_MONTH_INDEX, 0).getDate() },
  (_, index) => {
    const date = index + 1;

    return {
      id: getDayId(MOCK_MONTH_YEAR, MOCK_MONTH_INDEX, date),
      dayLabel: DAY_LABELS[new Date(MOCK_MONTH_YEAR, MOCK_MONTH_INDEX - 1, date).getDay()],
      date,
      totalHours: HOURS_BY_DAY[date] ?? 0,
    };
  }
);

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'tl-1',
    dayId: '2026-03-10',
    startTime: '09:00',
    endTime: '10:30',
    durationLabel: '1.5 ชม.',
    title: 'ประชุมทีมประจำสัปดาห์',
    category: 'Internal',
    tone: 'blue',
  },
  {
    id: 'tl-2',
    dayId: '2026-03-10',
    startTime: '10:30',
    endTime: '12:00',
    durationLabel: '1.5 ชม.',
    title: 'ออกแบบหน้า UI ใหม่',
    category: 'Design System',
    tone: 'violet',
  },
  {
    id: 'tl-3',
    dayId: '2026-03-10',
    startTime: '12:00',
    endTime: '13:00',
    durationLabel: '1 ชม.',
    title: 'พักเที่ยง',
    category: 'Personal',
    tone: 'slate',
  },
  {
    id: 'tl-4',
    dayId: '2026-03-10',
    startTime: '13:00',
    endTime: '16:30',
    durationLabel: '3.5 ชม.',
    title: 'เขียนโค้ด React Component',
    category: 'Frontend',
    tone: 'green',
  },
];

const toneClasses: Record<TimelineCardTone, { panel: string; badge: string; text: string }> = {
  blue: {
    panel: 'border-blue-200/80 bg-blue-50/70',
    badge: 'bg-blue-100/80 text-blue-700',
    text: 'text-blue-700',
  },
  violet: {
    panel: 'border-violet-200/80 bg-violet-50/70',
    badge: 'bg-violet-100/80 text-violet-700',
    text: 'text-violet-700',
  },
  slate: {
    panel: 'border-slate-200/90 bg-slate-50/60',
    badge: 'bg-slate-100 text-slate-700',
    text: 'text-slate-700',
  },
  green: {
    panel: 'border-emerald-200/90 bg-emerald-50/70',
    badge: 'bg-emerald-100/80 text-emerald-700',
    text: 'text-emerald-700',
  },
};

const formatTotalHours = (hours: number) => {
  if (!hours) {
    return '0 ชั่วโมง';
  }

  return `${hours} ชั่วโมง`;
};

const TimeSheetView = () => {
  const [selectedDayId, setSelectedDayId] = useState<DayItem['id']>(
    DAYS.find((day) => day.id === DEFAULT_SELECTED_DAY_ID)?.id ?? DAYS[0].id
  );

  const selectedDay = useMemo(
    () => DAYS.find((day) => day.id === selectedDayId) ?? DAYS[0],
    [selectedDayId]
  );

  const timelineItems = useMemo(
    () => TIMELINE_ITEMS.filter((item) => item.dayId === selectedDayId),
    [selectedDayId]
  );

  const daySelector = (
    <>
      {DAYS.map((day) => {
        const isActive = day.id === selectedDayId;
        const isWeekend = day.dayLabel === 'อา.' || day.dayLabel === 'ส.';

        return (
          <button
            key={day.id}
            className={cn(
              'grid w-full grid-cols-[44px_1fr_auto] items-center rounded-2xl px-4 py-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none',
              isActive
                ? isWeekend
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-black text-white shadow-lg'
                : isWeekend
                  ? 'bg-rose-50/70 text-rose-700 hover:bg-rose-100'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
            )}
            onClick={() => setSelectedDayId(day.id)}
            type="button"
          >
            <span
              className={cn(
                'text-base font-medium',
                isActive ? 'text-white/85' : isWeekend ? 'text-rose-500' : 'text-slate-500'
              )}
            >
              {day.dayLabel}
            </span>
            <span className="text-3xl leading-none font-bold">{day.date}</span>
            <span
              className={cn(
                'justify-self-end rounded-full px-2 py-1 text-sm font-semibold',
                isActive
                  ? 'bg-white/10 text-white'
                  : isWeekend
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-slate-100 text-slate-500'
              )}
            >
              {day.totalHours ? `${day.totalHours}h` : '-'}
            </span>
          </button>
        );
      })}
    </>
  );

  return (
    <div className="m-3 flex h-[calc(100dvh-1.5rem)] min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-4 xl:hidden">
        <div className="flex items-center justify-between">
          <button className="text-slate-500 hover:text-slate-800" type="button">
            <ChevronLeft className="size-5" />
          </button>
          <p className="text-xl font-bold text-slate-900">{MONTH_LABEL}</p>
          <button className="text-slate-500 hover:text-slate-800" type="button">
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const isActive = day.id === selectedDayId;
            const isWeekend = day.dayLabel === 'อา.' || day.dayLabel === 'ส.';

            return (
              <button
                className={cn(
                  'grid min-h-20 grid-rows-[auto_1fr_auto] place-items-center rounded-2xl px-1 py-2 transition-all',
                  isActive
                    ? isWeekend
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-black text-white shadow-md'
                    : isWeekend
                      ? 'bg-rose-50/70 text-rose-700 hover:bg-rose-100'
                      : 'text-slate-700 hover:bg-white'
                )}
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                type="button"
              >
                <span
                  className={cn(
                    'text-xs',
                    isActive ? 'text-white/80' : isWeekend ? 'text-rose-500' : 'text-slate-500'
                  )}
                >
                  {day.dayLabel}
                </span>
                <span className="mt-1 text-4xl leading-none font-bold">{day.date}</span>
                {isActive && (
                  <span className="mt-1 rounded-full bg-white/15 px-2 py-0.5 text-xs">
                    {day.totalHours}h
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <aside className="hidden min-h-0 w-82.5 shrink-0 border-r border-slate-200 bg-slate-50/60 xl:flex xl:flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <button className="text-slate-500 hover:text-slate-800" type="button">
              <ChevronLeft className="size-5" />
            </button>
            <p className="text-2xl font-bold text-slate-900">{MONTH_LABEL}</p>
            <button className="text-slate-500 hover:text-slate-800" type="button">
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="min-h-0 space-y-2 overflow-y-auto p-4">{daySelector}</div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-4xl leading-tight font-extrabold text-slate-950 sm:text-5xl">
                  Activities
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 sm:text-base">
                  <Clock3 className="size-4" />
                  <span>รวมเวลา {formatTotalHours(selectedDay.totalHours)}</span>
                </div>
              </div>

              <>
                <Button className="hidden rounded-2xl bg-black px-5 py-6 text-base font-semibold text-white hover:bg-black/90 sm:inline-flex">
                  <Plus className="size-5" />
                  เพิ่มกิจกรรม
                </Button>
                <Button
                  className="rounded-2xl bg-black text-white hover:bg-black/90 sm:hidden"
                  size="icon"
                >
                  <Plus className="size-5" />
                </Button>
              </>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
            <div className="absolute top-0 bottom-0 left-18.75 w-px bg-slate-200 sm:left-24" />

            <div className="space-y-4 pb-6">
              {timelineItems.length > 0 ? (
                timelineItems.map((item) => {
                  const tone = toneClasses[item.tone];

                  return (
                    <div
                      className="grid grid-cols-[68px_16px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[88px_20px_minmax(0,1fr)] sm:gap-4"
                      key={item.id}
                    >
                      <div className="pt-2 text-right">
                        <p className="text-xl leading-none font-bold text-slate-900 sm:text-3xl">
                          {item.startTime}
                        </p>
                        <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                          {item.durationLabel}
                        </p>
                      </div>

                      <div className="flex justify-center pt-3">
                        <span className="size-3 rounded-full border-3 border-slate-300 bg-white sm:size-4" />
                      </div>

                      <article className={cn('rounded-3xl border p-4 sm:p-6', tone.panel)}>
                        <h3
                          className={cn('text-xl font-bold wrap-break-word sm:text-3xl', tone.text)}
                        >
                          {item.title}
                        </h3>
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
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                  ไม่มีรายการกิจกรรมสำหรับวันที่เลือก
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TimeSheetView;
