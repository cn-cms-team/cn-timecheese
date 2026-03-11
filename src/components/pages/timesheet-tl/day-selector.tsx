import { cn } from '@/lib/utils';

import type { DayItem } from '@/types/timesheet';
import { getDayStatusBadge } from '@/lib/functions/timesheet-manage';

type DaySelectorProps = {
  days: DayItem[];
  selectedDayId: DayItem['id'];
  onSelectDay: (dayId: DayItem['id']) => void;
};

const DaySelector = ({ days, selectedDayId, onSelectDay }: DaySelectorProps) => (
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
            'grid w-full grid-cols-[44px_1fr_auto] cursor-pointer items-center rounded-2xl px-4 py-3 text-left shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none',
            isActive
              ? isWeekend
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-black text-white shadow-lg'
              : isWeekend
                ? 'bg-rose-50/70 text-rose-700 hover:bg-rose-100'
                : 'bg-white text-slate-700 hover:bg-slate-100'
          )}
          onClick={() => onSelectDay(day.id)}
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

export default DaySelector;
