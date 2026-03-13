import { cn } from '@/lib/utils';

import type { DayItem } from '@/types/timesheet';
import { getDayStatusBadge } from '@/lib/functions/timesheet-manage';
import { Skeleton } from '@/components/ui/skeleton';

type DaySelectorProps = {
  days: DayItem[];
  selectedDayId: DayItem['id'];
  onSelectDay: (dayId: DayItem['id']) => void;
  isLoading?: boolean;
};

const DaySelector = ({ days, selectedDayId, onSelectDay, isLoading = false }: DaySelectorProps) => {
  const now = new Date();
  const todayId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (isLoading) {
    return (
      <>
        {days.map((day) => (
          <div
            key={day.id}
            className="grid w-full grid-cols-[44px_1fr_auto] items-center rounded-2xl bg-white px-4 py-3 shadow-sm"
          >
            <Skeleton className="h-5 w-7 rounded-md" />
            <Skeleton className="h-9 w-10 rounded-md" />
            <Skeleton className="justify-self-end h-7 w-20 rounded-lg" />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {days.map((day) => {
        const isActive = day.id === selectedDayId;
        const isToday = day.id === todayId;
        const isWeekend = day.dayLabel === 'อา.' || day.dayLabel === 'ส.';
        const dayBadge = getDayStatusBadge(day.totalHours);
        const DayBadgeIcon = dayBadge.icon;

        return (
          <button
            key={day.id}
            className={cn(
              'grid w-full grid-cols-[44px_1fr_auto] cursor-pointer items-center rounded-2xl px-4 py-3 text-left shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none',
              isActive
                ? isToday
                  ? 'bg-blue-700 text-white shadow-lg'
                  : isWeekend
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'bg-black text-white shadow-lg'
                : isToday
                  ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-200 hover:bg-blue-100'
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
                isActive
                  ? 'text-white/85'
                  : isToday
                    ? 'text-blue-600'
                    : isWeekend
                      ? 'text-rose-500'
                      : 'text-slate-500'
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
};

export default DaySelector;
