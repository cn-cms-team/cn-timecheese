'use client';
import { useEffect } from 'react';

import { PERIOD_CALENDAR } from '@/lib/constants/period-calendar';

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
      case PERIOD_CALENDAR.WEEK:
        return <TimeSheetWeekCalendar />;
      case PERIOD_CALENDAR.MONTH:
      default:
        return <TimeSheetMonthCalendar />;
    }
  };

  return (
    <div className="py-3 px-2 lg:py-4 lg:px-4 bg-(--color-dash-bg) h-full rounded-lg">
      {renderCalendar()}
    </div>
  );
};

export default TimeSheetCalendarBody;
