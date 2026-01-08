'use client';

import { useState } from 'react';
import { isSameDay } from 'date-fns';

import { cn } from '@/lib/utils';
import { DAYS, DAYTASKSTATUS } from '@/lib/constants/period-calendar';

import TimeSheetForm from '../timesheet-form';
import TimeSheetPopover from '../timesheet-popover';
import TimeSheetdataDetail from '../timesheet-task-detail';
import { useTimeSheetContext } from '../view/timesheet-context';

const TimeSheetMonthCalendar = () => {
  const {
    tasks,
    selectedMonth,
    dailySecondsMap,
    selectedYear,
    selectedCalendar,
    getDayStatus,
    isPastDay,
    setSelectedCalendar,
  } = useTimeSheetContext();
  const year = selectedYear;
  const month = selectedMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(startOffset).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];
  while (totalSlots.length % 7 !== 0) {
    totalSlots.push(null);
  }
  const [isEdit, setIsEdit] = useState(false);

  const checkIsNotToday = (dateToCompare: Date, day: number) => {
    return (
      dateToCompare.getDate() !== day ||
      dateToCompare.getMonth() !== month ||
      dateToCompare.getFullYear() !== year
    );
  };

  return (
    <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F5F6F8]">
      <div className="grid grid-cols-7 bg-white border border-neutral-400 rounded-lg overflow-hidden shadow-lg">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center font-bold text-neutral-800 uppercase bg-white border-neutral-400"
          >
            {d}
          </div>
        ))}
        {totalSlots.map((day, index) => {
          const isBlank = !day;
          const dayOfMonth = new Date(selectedYear, selectedMonth.getMonth(), day);

          if (isBlank) {
            return (
              <div
                key={index}
                className={cn('min-h-[140px] border-t border-r border-neutral-400 bg-neutral-300')}
              />
            );
          }

          const isSaturday = dayOfMonth.getDay() === 6;
          const dayTasks = tasks.filter((task) => !checkIsNotToday(new Date(task.start_date), day));

          const visibleTasks = dayTasks.slice(0, 3);
          const hiddenTasks = dayTasks.slice(3);

          const isToday = isSameDay(dayOfMonth, new Date());
          const isPast = isPastDay(dayOfMonth);
          const status = getDayStatus(dayOfMonth, dailySecondsMap);
          const noTask = isPast && status === DAYTASKSTATUS.NOTASK;
          const inCompleted = isPast && status === DAYTASKSTATUS.INPROGRESS;

          return (
            <div key={index} className="relative min-h-[140px] max-h-[140px] overflow-hidden ">
              <TimeSheetPopover
                className="w-full p-0"
                align="center"
                triggerContent={
                  <div
                    className={cn(
                      'z-10 hover:bg-neutral-200 border-neutral-400 border-t cursor-pointer p-2  transition-colors relative group min-h-36 space-y-1',
                      isSaturday ? '' : 'border-r'
                    )}
                    onClick={() => {
                      setSelectedCalendar(new Date(year, month, day));
                    }}
                  >
                    <div
                      className={cn(
                        'mb-1 bg-transparent h-full',
                        inCompleted &&
                          'bg-[#ffa722] font-semibold text-black w-4 h-4 p-4 flex justify-center items-center rounded-full',
                        noTask &&
                          'bg-destructive text-white w-5 h-5 p-4 flex justify-center items-center rounded-full',
                        isToday &&
                          'bg-black text-white w-5 h-5 p-4 flex justify-center items-center rounded-full'
                      )}
                    >
                      {day}
                    </div>
                    {visibleTasks.map((task) => (
                      <TimeSheetPopover
                        key={task.id}
                        className="w-full p-0"
                        setIsEdit={setIsEdit}
                        triggerContent={
                          <div
                            className="bg-primary font-semibold text-[10px] p-1 rounded truncate cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {task.task_type_name}
                          </div>
                        }
                        popoverContent={(close) =>
                          isEdit ? (
                            <TimeSheetForm data={task} close={close} />
                          ) : (
                            <TimeSheetdataDetail
                              data={task}
                              setIsPopoverEdit={setIsEdit}
                              close={close}
                            />
                          )
                        }
                      />
                    ))}
                    {hiddenTasks.length > 0 && (
                      <TimeSheetPopover
                        className="w-full p-0"
                        align="center"
                        triggerContent={
                          <div
                            className="text-[10px] text-center text-black font-semibold cursor-pointer underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            + อีก {hiddenTasks.length} งาน
                          </div>
                        }
                        popoverContent={() => (
                          <div className="max-h-[300px] w-[260px] overflow-y-auto space-y-1 p-2">
                            {hiddenTasks.map((task) => (
                              <TimeSheetPopover
                                key={task.id}
                                className="w-full p-0"
                                setIsEdit={setIsEdit}
                                triggerContent={
                                  <div className="bg-primary font-semibold text-[10px] p-1 rounded cursor-pointer truncate">
                                    {task.task_type_name}
                                  </div>
                                }
                                popoverContent={(close) =>
                                  isEdit ? (
                                    <TimeSheetForm data={task} close={close} />
                                  ) : (
                                    <TimeSheetdataDetail
                                      data={task}
                                      setIsPopoverEdit={setIsEdit}
                                      close={close}
                                    />
                                  )
                                }
                              />
                            ))}
                          </div>
                        )}
                      />
                    )}
                  </div>
                }
                popoverContent={(close) => (
                  <TimeSheetForm startTime={selectedCalendar!} close={close} />
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSheetMonthCalendar;
