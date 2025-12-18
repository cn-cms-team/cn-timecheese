'use client';

import TimeSheetCalendarBody from '../timesheet-calendar-body';
import TimeSheetHeader from '../timesheet-header';
import TimeSheetPeriodSelection from '../timesheet-period-selection';
import TimeSheetProvider from './timesheet-context';
import { Header, HeaderTitle } from '@/components/ui/custom/header';

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
