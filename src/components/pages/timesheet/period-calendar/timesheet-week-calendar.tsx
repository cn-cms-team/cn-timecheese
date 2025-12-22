'use client';

import { cn } from '@/lib/utils';
import TimeSheetPopover from '../timesheet-popover';
import { addHours, eachHourOfInterval, startOfDay } from 'date-fns';
import TimeSheetForm from '../timesheet-form';
import TimeSheetEventCard from '../timesheet-event-card';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { useState } from 'react';

const TimeSheetWeekCalendar = () => {
  const currentDate = new Date();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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

  const hoursInDay = eachHourOfInterval({
    start: startOfDay(currentDate),
    end: addHours(startOfDay(currentDate), 23),
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F5F6F8]">
      <div className="flex border-b border-neutral-300 ml-13.5 bg-[#F5F6F8]">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className={`flex-1 p-2 text-center border-l border-neutral-300  min-w-[100px] ${
              currentDate.getDate() === day.getDate() ? 'bg-primary' : ''
            }`}
          >
            <div
              className={cn(
                'text-neutral-500 text-xs uppercase',
                currentDate.getDate() === day.getDate() ? ' text-black' : ''
              )}
            >
              {day.toLocaleDateString('th', { weekday: 'narrow' })}
            </div>
            <div
              className={cn(
                'text-neutral-600 font-bold text-lg',
                currentDate.getDate() === day.getDate() ? ' text-black' : ''
              )}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 relative  bg-[#F5F6F8]">
        <div className="flex min-h-[600px] relative">
          <div className="w-[55px] shrink-0 bg-transparent border-r border-neutral-300 text-xs text-neutral-500 font-mono text-center  sticky left-0 z-50">
            {hoursInDay.map((hour, index) => (
              <div
                key={index}
                className="h-20 border-b border-neutral-400/50 flex items-start justify-center pt-1 text-gray-400 font-semibold z-50"
              >
                {buddhistFormatDate(hour, 'HH:ii')}
              </div>
            ))}
          </div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                'flex-1 border-l border-neutral-300 relative min-w-[100px] hover:bg-neutral-800/10',
                index === 0 ? 'border-0' : ''
              )}
            >
              {hoursInDay.map((hr, index) => (
                <TimeSheetPopover
                  key={index}
                  align="center"
                  side="right"
                  className="w-90 p-0"
                  triggerContent={
                    <div
                      key={index}
                      className={cn(
                        'h-20 border-b border-neutral-400/30 cursor-pointer hover:bg-neutral-800/10 relative',
                        selectedDay === day.getDate() ? 'bg-neutral-200' : ''
                      )}
                      onClick={() => setSelectedDay(day.getDate())}
                    >
                      {(() => {
                        const currentDay = currentDate.getDate();
                        const startHour = currentDate.getHours();
                        const startTime = currentDate.getMinutes();
                        const endHour = new Date(currentDate.getTime() + 60 * 60 * 1000);
                        const durationHours = (endHour.getTime() - startTime) / (1000 * 60 * 60);
                        const top = (currentDate.getMinutes() / 60) * 80;
                        const height = Math.min(durationHours * 80, 80);
                        // const top = (startHour - 8) * 80 + (currentDate.getMinutes() / 60) * 80;
                        // const height = durationHours * 80;

                        if (startHour !== hr.getHours() || currentDay !== day.getDate())
                          return null;

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
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSheetWeekCalendar;
