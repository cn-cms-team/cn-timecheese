'use client';
import { addHours, startOfDay, eachHourOfInterval } from 'date-fns';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import TimeSheetFormPopover from './timesheet-form-popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
            <TimeSheetFormPopover
              key={index}
              align="center"
              className="w-90 p-0"
              triggerContent={
                <div
                  key={index}
                  className="h-20 border-b border-neutral-400/30 cursor-pointer hover:bg-neutral-200"
                ></div>
              }
              popoverContent={(close) => (
                <div className="grid grid-cols-1 p-3 w-full">
                  <header className="w-full text-end">
                    <Button
                      className="bg-transparent border-transparent hover:bg-transparent cursor-pointer p-2"
                      onClick={close}
                    >
                      <X width={14} stroke="#000" />
                    </Button>
                  </header>
                  <main className="w-full space-y-2">
                    <div className="w-full">
                      <Input placeholder="ชื่อ Task" />
                    </div>
                    <div className="flex items-center">
                      <Calendar width={25} strokeWidth={1} />
                      <Input
                        type="date"
                        className="ml-2"
                        defaultValue={buddhistFormatDate(now, 'yyyy-MM-dd')}
                      />
                    </div>
                    <div className="flex items-center">
                      <Clock width={25} strokeWidth={1} />
                      <Input
                        type="time"
                        className="mx-2 w-40"
                        defaultValue={buddhistFormatDate(now, 'HH:ii')}
                      />
                      <Input
                        type="time"
                        className="w-40"
                        defaultValue={buddhistFormatDate(now, 'HH:ii')}
                      />
                    </div>
                    <div className="flex flex-col space-y-2 mt-4">
                      <span>รายละเอียด</span>
                      <Textarea placeholder="อธิบายการทำงาน" className="h-30" />
                    </div>
                  </main>
                  <footer className="mt-6 space-x-2">
                    <Button
                      className="w-40 bg-transparent border-neutral-500 text-black hover:bg-neutral-200 cursor-pointer"
                      onClick={close}
                    >
                      ยกเลิก
                    </Button>
                    <Button className="w-40 mt-4 cursor-pointer text-black">บันทึก</Button>
                  </footer>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSheetDailyCalendar;
