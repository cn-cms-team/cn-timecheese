import { TimeSheetView } from '@/components/pages/timesheet/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time Sheet - CN Time Cheese',
  description: 'CN TimeSheet',
};

const TimeSheetPage = () => {
  return <TimeSheetView />;
};

export default TimeSheetPage;
