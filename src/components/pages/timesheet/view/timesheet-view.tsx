'use client';

import TimeSheetProvider from './timesheet-context';

const TimeSheetView = () => {
  return (
    <TimeSheetProvider>
      <div>Time Sheet View</div>
    </TimeSheetProvider>
  );
};

export default TimeSheetView;
