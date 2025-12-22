'use client';
import { useState } from 'react';
import { addHours, startOfDay, eachHourOfInterval } from 'date-fns';
import { buddhistFormatDate } from '@/lib/functions/date-format';

import TimeSheetForm from '../timesheet-form';
import TimeSheetPopover from '../timesheet-popover';
import TimeSheetEventCard from '../timesheet-event-card';
import { cn } from '@/lib/utils';

const TimeSheetDailyCalendar = () => {
  const now = new Date();
  const [selectedHr, setSelectedHr] = useState<number | null>(null);

  const hoursInDay = eachHourOfInterval({
    start: startOfDay(now),
    end: addHours(startOfDay(now), 23),
  });

  return (
    <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F5F6F8]">
      <div className="flex min-h-[600px] relative">
        <div className="w-14 shrink-0 bg-transparent border-r border-neutral-300 text-xs text-neutral-500 font-mono text-center sticky left-0 z-0">
          {hoursInDay.map((hour, index) => (
            <div
              key={index}
              className="h-20 border-b border-neutral-400/50 flex items-start justify-center pt-1 text-gray-400 font-semibold"
            >
              {buddhistFormatDate(hour, 'HH:ii')}
            </div>
          ))}
        </div>
        <div className="flex-1 relative min-w-[150px] group">
          {hoursInDay.map((hr, index) => (
            <TimeSheetPopover
              key={index}
              align="center"
              className="w-90 p-0"
              triggerContent={
                <div
                  key={index}
                  className={cn(
                    'h-20 border-b border-neutral-400/30 cursor-pointer hover:bg-neutral-200 relative',
                    selectedHr === hr.getHours() ? 'bg-neutral-200' : ''
                  )}
                  onClick={() => setSelectedHr(hr.getHours())}
                >
                  {(() => {
                    const startHour = now.getHours();
                    const startTime = now.getMinutes();
                    const endHour = new Date(now.getTime() + 60 * 60 * 1000);
                    const durationHours = (endHour.getTime() - startTime) / (1000 * 60 * 60);
                    const top = (now.getMinutes() / 60) * 80;
                    const height = Math.min(durationHours * 80, 80);
                    // const top = (startHour - 8) * 80 + (now.getMinutes() / 60) * 80;
                    // const height = durationHours * 80;

                    if (startHour !== hr.getHours()) return null;

                    return (
                      <div
                        className="absolute w-[90%] left-[5%] z-10"
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <TimeSheetEventCard />
                      </div>
                    );
                  })()}
                </div>
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
