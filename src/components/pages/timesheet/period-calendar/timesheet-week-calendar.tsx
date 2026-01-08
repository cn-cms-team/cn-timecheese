'use client';
import { useEffect } from 'react';
import { addWeeks, format, isSameDay } from 'date-fns';

import { cn } from '@/lib/utils';
import { th } from 'date-fns/locale';
import { formatDate } from '@/lib/functions/date-format';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYTASKSTATUS } from '@/lib/constants/period-calendar';

import { Button } from '@/components/ui/button';
import { useTimeSheetContext } from '../view/timesheet-context';
import TimeSheetWeekCalendarBody from './timesheet-week-calendar-body';

const TimeSheetWeekCalendar = () => {
  const {
    weekDays,
    isPastDay,
    getDayStatus,
    dailySecondsMap,
    selectedMonth,
    selectedYear,
    setSelectedCalendar,
    setSelectedMonth,
    setSelectedYear,
    setWeekAnchorDate,
  } = useTimeSheetContext();

  const handlePrevWeek = () => {
    setWeekAnchorDate((prev) => {
      const next = addWeeks(prev, -1);

      setSelectedCalendar(next);
      setSelectedMonth(next);
      setSelectedYear(next.getFullYear());

      return next;
    });
  };

  const handleNextWeek = () => {
    setWeekAnchorDate((prev) => {
      const next = addWeeks(prev, 1);

      setSelectedCalendar(next);
      setSelectedMonth(next);
      setSelectedYear(next.getFullYear());

      return next;
    });
  };

  useEffect(() => {
    setWeekAnchorDate((prev) => {
      const day = prev.getDate();

      return new Date(selectedYear, selectedMonth.getMonth(), day);
    });
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col h-full bg-[#F5F6F8] overflow-hidden">
      <div className="flex items-center border-b border-neutral-300 bg-[#F5F6F8] relative">
        <Button
          onClick={handlePrevWeek}
          className="px-3 absolute left-13 h-full flex items-center min-w-[54px] cursor-pointer p-0 bg-transparent hover:bg-transparent"
        >
          <ChevronLeft stroke="#000" />
        </Button>

        <div className="flex flex-1 ms-13.5">
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            const isPast = isPastDay(day);
            const status = getDayStatus(day, dailySecondsMap);
            const noTask = isPast && status === DAYTASKSTATUS.NOTASK;
            const inCompleted = isPast && status === DAYTASKSTATUS.INPROGRESS;
            const isIgnore = isPast && status === DAYTASKSTATUS.IGNORE;

            return (
              <div
                key={idx}
                className={cn(
                  'flex-1 p-2 text-center border-l border-neutral-300 ',
                  noTask && 'bg-destructive ',
                  inCompleted && 'bg-[#FFA722] ',
                  isIgnore && 'bg-neutral-100',
                  isToday && 'bg-black',
                  idx === weekDays.length - 1 && 'border-r border-neutral-300'
                )}
              >
                <div
                  className={cn(
                    'text-xs uppercase',
                    isToday || inCompleted || noTask ? 'text-white' : 'text-neutral-500'
                  )}
                >
                  {format(day, 'EEE', { locale: th })}
                </div>
                <div
                  className={cn(
                    'font-bold text-lg',
                    isToday || inCompleted || noTask ? 'text-white' : 'text-neutral-600'
                  )}
                >
                  {formatDate(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          onClick={handleNextWeek}
          className="px-3 absolute -right-3 h-full flex items-center min-w-[54px] cursor-pointer p-0 bg-transparent hover:bg-transparent "
        >
          <ChevronRight stroke="#000" />
        </Button>
      </div>
      <div className="flex-1 relative  bg-[#F5F6F8]">
        <TimeSheetWeekCalendarBody weekDays={weekDays} />
      </div>
    </div>
  );
};

export default TimeSheetWeekCalendar;
