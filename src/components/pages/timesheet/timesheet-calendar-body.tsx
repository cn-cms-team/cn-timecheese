'use client';

import { PERIODCALENDAR } from '@/lib/constants/period-calendar';
import { useTimeSheetContext } from './view/timesheet-context';
import TimeSheetDailyCalendar from './timesheet-daily-calendar';

const TimeSheetCalendarBody = () => {
  const { period } = useTimeSheetContext();

  return (
    <div className="py-4 px-4 bg-[#F5F6F8] h-full">
      {(() => {
        if (period === PERIODCALENDAR.DATE) {
          return <TimeSheetDailyCalendar />;
        }

        return 'Calendar Area';
      })()}
    </div>
  );
};

export default TimeSheetCalendarBody;
