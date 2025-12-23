'use client';

import TimeSheetCalendar from './timesheet-calendar';
import TimeSheetTimeSummary from './timesheet-time-summary';
import TimeSheetUserInfo from '../timesheet-user-info';

const TimeSheetHeader = () => (
  <div className="grid  lg:grid-cols-1 xl:grid-cols-4 grid-cols-1 w-full bg-[#f8f8f8f8] p-4 gap-4">
    <TimeSheetUserInfo />
    <TimeSheetCalendar />
    <TimeSheetTimeSummary />
  </div>
);

export default TimeSheetHeader;
