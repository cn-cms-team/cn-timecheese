'use client';
import { addHours, startOfDay, eachHourOfInterval } from 'date-fns';
import { buddhistFormatDate } from '@/lib/functions/date-format';

import TimeSheetForm from './timesheet-form';
import TimeSheetPopover from './timesheet-popover';

const TimeSheetDailyCalendar = () => {
  const now = new Date();

  const hoursInDay = eachHourOfInterval({
    start: startOfDay(now),
    end: addHours(startOfDay(now), 23),
  });

  return (
    <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F5F6F8]">
      <div className="flex min-h-[600px] relative">
        <div className="w-14 shrink-0 bg-transparent border-r border-neutral-400 text-xs text-neutral-500 font-mono text-center sticky left-0 z-10 shadow-sm">
          {hoursInDay.map((hour, index) => (
            <div
              key={index}
              className="h-20 border-b border-neutral-400/50 flex items-start justify-center pt-1 text-gray-400 font-semibold"
            >
              {buddhistFormatDate(hour, 'HH:ii')}
            </div>
          ))}
        </div>
        <div className="flex-1 border-l border-neutral-400 relative min-w-[150px] group">
          {hoursInDay.map((_, index) => (
            <TimeSheetPopover
              key={index}
              align="center"
              className="w-90 p-0"
              triggerContent={
                <div
                  key={index}
                  className="h-20 border-b border-neutral-400/30 cursor-pointer hover:bg-neutral-200"
                ></div>
              }
              popoverContent={(close) => <TimeSheetForm close={close} />}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSheetDailyCalendar;
