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

interface IProps {
  weekDays: Date[];
  loading?: boolean;
}

const TimeSheetWeekCalendarBody = ({ weekDays, loading = false }: IProps) => {
  const currentDate = new Date();
  const { tasks, isPopoverEdit, setIsPopoverEdit } = useTimeSheetContext();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectHr, setSelectHr] = useState<{ start: number; end: number } | null>(null);

  const start = selectedDay && selectHr ? new Date(selectedDay) : undefined;
  start?.setHours(selectHr!.start, 0, 0, 0);

  const end = selectedDay && selectHr ? new Date(selectedDay) : undefined;
  end?.setHours(selectHr!.end, 0, 0, 0);

  const hoursInDay = eachHourOfInterval({
    start: startOfDay(currentDate),
    end: addHours(startOfDay(currentDate), 23),
  });

  return (
    <div className="flex min-h-[600px] relative">
      <div className="w-[55px] shrink-0 bg-transparent border-r border-neutral-300 text-xs text-neutral-500 font-mono text-center sticky left-0 z-50">
        {loading
          ? Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="h-20 bg-gray-300 animate-pulse border-b border-neutral-400/50 flex items-start justify-center pt-1 text-gray-400 font-semibold"
              />
            ))
          : hoursInDay.map((hour, index) => (
              <div
                key={index}
                className="h-20 border-b border-neutral-400/50 flex items-start justify-center pt-1 text-gray-400 font-semibold z-50"
              >
                {buddhistFormatDate(hour, 'HH:ii')}
              </div>
            ))}
      </div>
      {weekDays.map((day, index) => {
        const isSaturday = day.getDay() === 6;
        return (
          <div
            key={index}
            className={cn(
              'flex-1 border-l border-neutral-300 relative min-w-[100px]',
              index === 0 ? 'border-0' : '',
              isSaturday && 'border-r border-neutral-300'
            )}
            onClick={() => setSelectedDay(day)}
          >
            {loading
              ? Array.from({ length: 24 }).map((_, hrIndex) => (
                  <div
                    key={hrIndex}
                    className="h-20 bg-gray-300 animate-pulse border-b border-neutral-400/50 cursor-pointer"
                  />
                ))
              : hoursInDay.map((hr, hrIndex) => {
                  const hasTask = tasks.some((task) => {
                    const taskStart = new Date(task.start_date);
                    const taskEnd = new Date(task.end_date);

                    return (
                      taskStart.getHours() <= hr.getHours() &&
                      taskEnd.getHours() > hr.getHours() &&
                      taskStart.getDate() === day.getDate()
                    );
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
            {tasks.map((task) => {
              const start = new Date(task.start_date);
              const end = new Date(task.end_date);

              end.setFullYear(start.getFullYear());
              end.setMonth(start.getMonth());
              end.setDate(start.getDate());

              const durationMs = end.getTime() - start.getTime();
              const durationHours = durationMs / 3600000;

              const height = Math.max(durationHours * 80, 20);

              const top = start.getHours() * 80 + (start.getMinutes() / 60) * 80;

              if (
                start.getDate() !== day.getDate() ||
                start.getMonth() !== day.getMonth() ||
                start.getFullYear() !== day.getFullYear()
              ) {
                return null;
              }

              return (
                <TimeSheetPopover
                  key={task.id}
                  align="center"
                  side="right"
                  className={`w-full p-0`}
                  setIsEdit={setIsPopoverEdit}
                  contentProps={{
                    avoidCollisions: true,
                    collisionPadding: 12,
                    sticky: 'partial',
                    sideOffset: 8,
                  }}
                  triggerContent={
                    <div
                      className="absolute left-[5%] w-[90%] overflow-hidden"
                      style={{
                        top: top,
                        height,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TimeSheetEventCard data={task} />
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
