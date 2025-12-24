'use client';

import TimeSheetHeader from '../header/timesheet-header';
import TimeSheetProvider from './timesheet-context';
import TimeSheetCalendarBody from '../timesheet-calendar-body';
import TimeSheetPeriodSelection from '../header/timesheet-period-selection';
import ModuleLayout from '@/components/layouts/ModuleLayout';

const TimeSheetView = () => {
  return (
    <ModuleLayout
      headerTitle={'Time Sheet'}
      headerButton={null}
      content={
        <TimeSheetProvider>
          <TimeSheetHeader />
          <TimeSheetPeriodSelection />
          <TimeSheetCalendarBody />
        </TimeSheetProvider>
      }
    />
  );
};

export default TimeSheetView;
