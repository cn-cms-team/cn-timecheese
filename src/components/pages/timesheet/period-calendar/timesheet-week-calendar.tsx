'use client';

import { cn } from '@/lib/utils';

import TimeSheetWeekCalendarBody from './timesheet-week-calendar-body';

const TimeSheetWeekCalendar = () => {
  const currentDate = new Date();

  const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F5F6F8]">
      <div className="flex border-b border-neutral-300 ml-13.5 bg-[#F5F6F8]">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className={`flex-1 p-2 text-center border-l border-neutral-300  min-w-[100px] ${
              currentDate.getDate() === day.getDate() ? 'bg-black ' : ''
            }`}
          >
            <div
              className={cn(
                'text-neutral-500 text-xs uppercase',
                currentDate.getDate() === day.getDate() ? ' text-white' : ''
              )}
            >
              {day.toLocaleDateString('th', { weekday: 'narrow' })}
            </div>
            <div
              className={cn(
                'text-neutral-600 font-bold text-lg',
                currentDate.getDate() === day.getDate() ? ' text-white' : ''
              )}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 relative  bg-[#F5F6F8]">
        <TimeSheetWeekCalendarBody />
      </div>
    </div>
  );
};

export default TimeSheetWeekCalendar;
