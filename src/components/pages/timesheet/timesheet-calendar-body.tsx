'use client';

import { PERIODCALENDAR } from '@/lib/constants/period-calendar';
import { useTimeSheetContext } from './view/timesheet-context';
import TimeSheetDailyCalendar from './period-calendar/timesheet-daily-calendar';
import TimeSheetWeekCalendar from './period-calendar/timesheet-week-calendar';
import TimeSheetMonthCalendar from './period-calendar/timesheet-month-calendar';

const TimeSheetCalendarBody = () => {
  const { period } = useTimeSheetContext();

  const renderCalendar = () => {
    switch (period) {
      case PERIODCALENDAR.DATE:
        return <TimeSheetDailyCalendar />;
      case PERIODCALENDAR.WEEK:
        return <TimeSheetWeekCalendar />;
      case PERIODCALENDAR.MONTH:
      default:
        return <TimeSheetMonthCalendar />;
    }
  };

  return <div className="py-3 px-2 lg:py-4 lg:px-4 bg-[#F5F6F8] h-full">{renderCalendar()}</div>;
};

export default TimeSheetCalendarBody;
