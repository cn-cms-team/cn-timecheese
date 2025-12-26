'use client';

import TimeSheetMonthPicker from './timesheet-month-picker';
import TimeSheetTimeSummary from './timesheet-time-summary';
import TimeSheetUserInfo from './timesheet-user-info';

const TimeSheetHeader = () => (
  <div className="grid  lg:grid-cols-1 xl:grid-cols-4 grid-cols-1 w-full bg-[#f8f8f8f8] p-4 gap-4">
    <TimeSheetUserInfo />
    <TimeSheetMonthPicker />
    <TimeSheetTimeSummary />
  </div>
);

export default TimeSheetHeader;
