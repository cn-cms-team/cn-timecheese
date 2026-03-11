'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TIMELINE_ITEMS } from '@/lib/constants/timesheet';
import DaySelector from '../day-selector';
import TimelineList from '../timeline-list';
import type { DayItem } from '@/types/timesheet';
import {
  formatMonthLabel,
  formatTotalHours,
  getDayId,
  getDaysForMonth,
  parseDayId,
} from '@/lib/functions/timesheet-manage';
import { HeaderTitle } from '@/components/ui/custom/header';

const today = new Date();
const DEFAULT_MONTH_DATE = new Date(today.getFullYear(), today.getMonth(), 1);
const DEFAULT_SELECTED_DAY_ID = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDayId(getDayId(now.getFullYear(), now.getMonth() + 1, now.getDate()));
  };

  return (
    <div className="m-3 flex h-[calc(100dvh-1.5rem)] min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-4 xl:hidden">
        <div className="flex justify-between align-middle">
          <HeaderTitle title={monthLabel} leaveUrl="/" />
          <div className="">
            <Button
              aria-label="Today"
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              onClick={handleGoToToday}
              size="icon"
              type="button"
            >
              <CalendarDays className="size-5" />
            </Button>
          </div>
        </div>

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
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
              onClick={() => handleMonthChange(-1)}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-slate-900">{monthLabel}</p>
              <Button
                aria-label="Today"
                className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                onClick={handleGoToToday}
                size="icon"
                type="button"
              >
                <CalendarDays className="size-4.5" />
              </Button>

              <button
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
                onClick={() => handleMonthChange(1)}
                type="button"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 space-y-2 overflow-y-auto p-4">
            <DaySelector days={days} selectedDayId={selectedDayId} onSelectDay={setSelectedDayId} />
          </div>
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
              <TimelineList timelineItems={timelineItems} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TimeSheetView;
