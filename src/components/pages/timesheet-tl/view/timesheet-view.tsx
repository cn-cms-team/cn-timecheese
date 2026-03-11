'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUp,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Trash2,
  Pencil,
  Plus,
} from 'lucide-react';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DayItem = {
  id: string;
  dayLabel: string;
  date: number;
  totalHours: number;
};

type DayTimesheetStatus = 'none' | 'under' | 'exact' | 'over';

type TimelineCardTone = 'blue' | 'violet' | 'slate' | 'green';

type TimelineItem = {
  id: string;
  dayId: DayItem['id'];
  startTime: string;
  endTime: string;
  durationLabel: string;
  title: string;
  description: string;
  category: string;
  tone: TimelineCardTone;
};

const today = new Date();
const DEFAULT_MONTH_DATE = new Date(today.getFullYear(), today.getMonth(), 1);
const DEFAULT_SELECTED_DAY_ID = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const DAY_LABELS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

const HOURS_BY_DAY_ID: Record<string, number> = {
  '2026-03-03': 6,
  '2026-03-04': 7.5,
  '2026-03-05': 8,
  '2026-03-06': 7,
  '2026-03-10': 7.5,
  '2026-03-11': 8,
  '2026-03-12': 6.5,
  '2026-03-13': 7,
  '2026-03-17': 8,
  '2026-03-18': 8,
  '2026-03-19': 7,
  '2026-03-20': 6,
  '2026-03-24': 8,
  '2026-03-25': 7.5,
  '2026-03-26': 8,
  '2026-03-27': 6.5,
  '2026-03-31': 9,
};

const getDayId = (year: number, month: number, date: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

const parseDayId = (dayId: string) => {
  const [year, month, date] = dayId.split('-').map(Number);
  return new Date(year, month - 1, date);
};

const getDaysForMonth = (year: number, monthIndex: number): DayItem[] =>
  Array.from({ length: new Date(year, monthIndex + 1, 0).getDate() }, (_, index) => {
    const date = index + 1;
    const id = getDayId(year, monthIndex + 1, date);

    return {
      id,
      dayLabel: DAY_LABELS[new Date(year, monthIndex, date).getDay()],
      date,
      totalHours: HOURS_BY_DAY_ID[id] ?? 0,
    };
  });

const formatMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    month: 'long',
    year: 'numeric',
  }).format(date);

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'tl-1',
    dayId: '2026-03-10',
    startTime: '09:00',
    endTime: '10:30',
    durationLabel: '1.5 ชม.',
    title: 'ประชุมทีมประจำสัปดาห์',
    description:
      'อัปเดตสถานะงานของแต่ละทีมย่อย สรุปงานที่ติดบล็อก และวางแผนลำดับความสำคัญของงานในสปรินต์ถัดไปร่วมกับทีม UX และทีม Backend',
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
    description:
      'ปรับโครงร่างหน้าจอ timesheet ให้รองรับการใช้งานบนมือถือและ desktop โดยเน้นลำดับข้อมูลที่อ่านง่าย เพิ่มสถานะรายวัน และออกแบบคอมโพเนนต์การ์ดกิจกรรมให้ขยายตามเนื้อหาได้',
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
    description: 'พักรับประทานอาหารและเตรียมงานสำหรับช่วงบ่าย',
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
    description:
      'พัฒนา timeline card component พร้อมสถานะสี, เพิ่มฟิลด์รายละเอียดกิจกรรม, ปรับปรุงการจัดวางในหน้าจอเล็ก และทดสอบการแสดงผลกรณีข้อความยาวหลายบรรทัดให้ไม่ถูกตัด',
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

const formatHourValue = (hours: number) => hours.toFixed(1);

const getDayTimesheetStatus = (hours: number): DayTimesheetStatus => {
  if (!hours) {
    return 'none';
  }

  if (hours < 8) {
    return 'under';
  }

  if (hours === 8) {
    return 'exact';
  }

  return 'over';
};

const getDayStatusBadge = (hours: number) => {
  const status = getDayTimesheetStatus(hours);

  if (status === 'none') {
    return {
      icon: Circle,
      value: null,
      className: 'bg-slate-100 text-slate-500',
      activeClassName: 'bg-white/15 text-white',
      ariaLabel: 'ยังไม่มีการลงเวลา',
    };
  }

  if (status === 'under') {
    return {
      icon: AlertTriangle,
      value: `${formatHourValue(hours)}h`,
      className: 'bg-amber-100 text-amber-700',
      activeClassName: 'bg-amber-400/25 text-white',
      ariaLabel: `ลงเวลา ${hours} ชั่วโมง ยังไม่ครบ`,
    };
  }

  if (status === 'exact') {
    return {
      icon: Check,
      value: `${formatHourValue(hours)}h`,
      className: 'bg-emerald-100 text-emerald-700',
      activeClassName: 'bg-emerald-400/25 text-white',
      ariaLabel: 'ลงเวลาครบ 8 ชั่วโมง',
    };
  }

  return {
    icon: ArrowUp,
    value: `${formatHourValue(hours)}h`,
    className: 'bg-sky-100 text-sky-700',
    activeClassName: 'bg-sky-400/25 text-white',
    ariaLabel: `ลงเวลาเกิน 8 ชั่วโมง ${hours} ชั่วโมง`,
  };
};

const TimeSheetView = () => {
  const [currentMonth, setCurrentMonth] = useState(DEFAULT_MONTH_DATE);

  const days = useMemo(
    () => getDaysForMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const [selectedDayId, setSelectedDayId] = useState<DayItem['id']>(
    days.find((day) => day.id === DEFAULT_SELECTED_DAY_ID)?.id ?? days[0].id
  );

  useEffect(() => {
    if (!days.some((day) => day.id === selectedDayId)) {
      setSelectedDayId(days[0].id);
    }
  }, [days, selectedDayId]);

  const monthLabel = useMemo(() => formatMonthLabel(currentMonth), [currentMonth]);

  const handleMonthChange = (offset: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const selectedDay = useMemo(
    () => days.find((day) => day.id === selectedDayId) ?? days[0],
    [days, selectedDayId]
  );

  const timelineItems = useMemo(
    () => TIMELINE_ITEMS.filter((item) => item.dayId === selectedDayId),
    [selectedDayId]
  );

  const handleDayNavigate = (offset: number) => {
    const selectedDate = parseDayId(selectedDayId);
    const nextDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + offset
    );

    setCurrentMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    setSelectedDayId(getDayId(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()));
  };

  const daySelector = (
    <>
      {days.map((day) => {
        const isActive = day.id === selectedDayId;
        const isWeekend = day.dayLabel === 'อา.' || day.dayLabel === 'ส.';
        const dayBadge = getDayStatusBadge(day.totalHours);
        const DayBadgeIcon = dayBadge.icon;

        return (
          <button
            key={day.id}
            className={cn(
              'grid w-full grid-cols-[44px_1fr_auto] items-center rounded-2xl px-4 py-3 text-left shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none',
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
                'justify-self-end inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold',
                isActive ? dayBadge.activeClassName : dayBadge.className
              )}
              aria-label={dayBadge.ariaLabel}
            >
              <DayBadgeIcon className="size-3.5" />
              {dayBadge.value && <span>{dayBadge.value}</span>}
            </span>
          </button>
        );
      })}
    </>
  );

  return (
    <div className="m-3 flex h-[calc(100dvh-1.5rem)] min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-4 xl:hidden">
        <p className="text-base font-semibold text-slate-500">{monthLabel}</p>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
          <button
            aria-label="วันก่อนหน้า"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handleDayNavigate(-1)}
            type="button"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-500">{selectedDay.dayLabel}</p>
            <p className="text-4xl leading-none font-black text-slate-900">{selectedDay.date}</p>
            <p className="mt-1 text-sm text-slate-500">
              รวมเวลา {formatTotalHours(selectedDay.totalHours)}
            </p>
          </div>

          <button
            aria-label="วันถัดไป"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handleDayNavigate(1)}
            type="button"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <aside className="hidden min-h-0 w-82.5 shrink-0 border-r border-slate-200 bg-slate-50/60 xl:flex xl:flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <button
              className="text-slate-500 hover:text-slate-800"
              onClick={() => handleMonthChange(-1)}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="text-2xl font-bold text-slate-900">{monthLabel}</p>
            <button
              className="text-slate-500 hover:text-slate-800"
              onClick={() => handleMonthChange(1)}
              type="button"
            >
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
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className={cn(
                              'text-xl font-bold wrap-break-word sm:text-3xl',
                              tone.text
                            )}
                          >
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
