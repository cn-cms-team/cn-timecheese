'use client';

import { useState } from 'react';
import { addHours, eachHourOfInterval, startOfDay } from 'date-fns';

import { cn } from '@/lib/utils';
import { buddhistFormatDate } from '@/lib/functions/date-format';

import TimeSheetForm from '../timesheet-form';
import TimeSheetPopover from '../timesheet-popover';
import TimeSheetEventCard from '../timesheet-event-card';
import TimeSheetdataDetail from '../timesheet-task-detail';
import { useTimeSheetContext } from '../view/timesheet-context';

const TimeSheetWeekCalendarBody = () => {
  const currentDate = new Date();
  const { tasks, selectedCalendar, isPopoverEdit, setSelectedCalendar, setIsPopoverEdit } =
    useTimeSheetContext();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectHr, setSelectHr] = useState<{ start: number; end: number } | null>(null);

  const start = selectedDay && selectHr ? new Date(selectedDay) : undefined;
  start?.setHours(selectHr!.start, 0, 0, 0);

  const end = selectedDay && selectHr ? new Date(selectedDay) : undefined;
  end?.setHours(selectHr!.end, 0, 0, 0);

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
      {weekDays.map((day, index) => {
        return (
          <div
            key={index}
            className={cn(
              'flex-1 border-l border-neutral-300 relative min-w-[100px] hover:bg-neutral-800/10',
              index === 0 ? 'border-0' : ''
            )}
            onClick={(e) => setSelectedDay(day)}
          >
            {hoursInDay.map((hr, hrIndex) => {
              const hasTask = tasks.some((task) => {
                const taskStart = new Date(task.start_date);
                const taskEnd = new Date(task.end_date);

                return taskStart.getHours() <= hr.getHours() && taskEnd.getHours() > hr.getHours();
              });

              if (hasTask) {
                return (
                  <div
                    key={hrIndex}
                    className="h-20 border-b border-neutral-400/30 cursor-not-allowed hover:bg-neutral-200"
                  />
                );
              } else {
                return (
                  <TimeSheetPopover
                    key={hrIndex}
                    align="center"
                    side="right"
                    className="w-90 p-0"
                    triggerContent={
                      <div
                        className="h-20 border-b border-neutral-400/30 cursor-pointer hover:bg-neutral-200"
                        onClick={() =>
                          setSelectHr(() => ({
                            start: hr.getHours(),
                            end: hr.getHours() + 1,
                          }))
                        }
                      />
                    }
                    popoverContent={(close) => (
                      <TimeSheetForm
                        startTime={start || undefined}
                        endTime={end || undefined}
                        close={close}
                      />
                    )}
                  />
                );
              }
            })}
            {tasks
              .filter((t) => new Date(t.start_date).getDate() === day.getDate())
              .map((task) => {
                const start = new Date(task.start_date);
                const end = new Date(task.end_date);

                const top = start.getHours() * 80 + (start.getMinutes() / 60) * 80;

                const height = ((end.getTime() - start.getTime()) / 3600000) * 80;

                return (
                  <TimeSheetPopover
                    key={task.id}
                    align="center"
                    side="right"
                    className="w-full"
                    triggerContent={
                      <div
                        className="absolute left-[5%] w-[90%]"
                        style={{ top, height }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TimeSheetEventCard data={task} height={height} />
                      </div>
                    }
                    popoverContent={(close) =>
                      isPopoverEdit ? (
                        <TimeSheetForm
                          data={task}
                          close={() => {
                            close();
                            setIsPopoverEdit(false);
                          }}
                        />
                      ) : (
                        <TimeSheetdataDetail
                          data={task}
                          setIsPopoverEdit={setIsPopoverEdit}
                          close={close}
                        />
                      )
                    }
                  />
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSheetWeekCalendarBody;
