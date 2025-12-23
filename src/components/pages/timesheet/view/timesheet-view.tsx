'use client';

import TimeSheetHeader from '../header/timesheet-header';
import TimeSheetProvider from './timesheet-context';
import TimeSheetCalendarBody from '../timesheet-calendar-body';
import { Header, HeaderTitle } from '@/components/ui/custom/header';
import TimeSheetPeriodSelection from '../header/timesheet-period-selection';

const TimeSheetView = () => {
  return (
    <TimeSheetProvider>
      <div className="px-4 w-full noto-sans">
        <Header>
          <HeaderTitle title="Time Sheet" />
        </Header>
        <TimeSheetHeader />
        <TimeSheetPeriodSelection />
        <TimeSheetCalendarBody />
      </div>
    </TimeSheetProvider>
  );
};

export default TimeSheetView;
