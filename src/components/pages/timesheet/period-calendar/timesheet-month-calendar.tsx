'use client';

import { cn } from '@/lib/utils';
import TimeSheetPopover from '../timesheet-popover';
import TimeSheetForm from '../timesheet-form';
import { useTimeSheetContext } from '../view/timesheet-context';

const TimeSheetMonthCalendar = () => {
  const currentDate = new Date();
  const { tasks, selectedMonth, selectedYear, selectedCalendar, setSelectedCalendar } =
    useTimeSheetContext();
  const year = selectedYear;
  const month = selectedMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(startOffset).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];
  const checkIsToday = (dateToCompare: Date, day: number) => {
    return (
      dateToCompare.getDate() !== day ||
      dateToCompare.getMonth() !== month ||
      dateToCompare.getFullYear() !== year
    );
  };

  return (
    <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F5F6F8]">
      <div className="grid grid-cols-7 gap-px bg-[#F5F6F8] border border-neutral-800 rounded-lg overflow-hidden shadow-lg">
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d) => (
          <div
            key={d}
            className=" p-3 text-center font-bold text-neutral-800 uppercase bg-[#F5F6F8]"
          >
            {d}
          </div>
        ))}
        {totalSlots.map((day, index) => {
          return (
            <TimeSheetPopover
              className="w-full p-0"
              key={index}
              align="center"
              side="right"
              triggerContent={
                <div
                  className="bg-[#F5F6F8] hover:bg-neutral-300 hover:border-0 cursor-pointer min-h-[120px] max-h-[120px] p-2  transition-colors border-t border-neutral-800 relative group"
                  onClick={() => {
                    if (day) {
                      setSelectedCalendar(new Date(year, month, day));
                    }
                  }}
                >
                  <div
                    className={cn(
                      `text-sm font-bold mb-2 w-7 h-7 flex items-center justify-center rounded-full  text-neutral-600  `,
                      checkIsToday(currentDate, day)
                        ? 'bg-transparent group-hover:text-black'
                        : 'bg-black text-white hover:text-white'
                    )}
                  >
                    {day}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {tasks.map((task) => {
                      const taskDate = new Date(task.start_date);
                      if (checkIsToday(taskDate, day)) return;
                      return (
                        <div
                          key={task.id}
                          className="w-full bg-primary flex items-center justify-center pt-0.5 font-semibold rounded-sm min-h-1 text-[8px] truncate p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {task.project_name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              }
              popoverContent={(close) => (
                <TimeSheetForm startTime={selectedCalendar!} close={close} />
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TimeSheetMonthCalendar;
