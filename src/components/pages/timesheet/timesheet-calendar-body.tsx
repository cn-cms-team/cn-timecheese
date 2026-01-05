'use client';
import { useEffect } from 'react';

import { PERIODCALENDAR } from '@/lib/constants/period-calendar';

import { useTimeSheetContext } from './view/timesheet-context';
import TimeSheetWeekCalendar from './period-calendar/timesheet-week-calendar';
import TimeSheetMonthCalendar from './period-calendar/timesheet-month-calendar';

const TimeSheetCalendarBody = () => {
  const { period, fetchOptions, getTask, getUserInfo } = useTimeSheetContext();

  useEffect(() => {
    Promise.all([fetchOptions(), getUserInfo(), getTask()]);
  }, []);

  const renderCalendar = () => {
    switch (period) {
      case PERIODCALENDAR.WEEK:
        return <TimeSheetWeekCalendar />;
      case PERIODCALENDAR.MONTH:
      default:
        return <TimeSheetMonthCalendar />;
    }
  };

  return <div className="py-3 px-2 lg:py-4 lg:px-4 bg-[#F5F6F8] h-full ">{renderCalendar()}</div>;
};

export default TimeSheetCalendarBody;
