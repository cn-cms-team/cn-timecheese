import { TimeSheetView } from '@/components/pages/timesheet';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time Sheet - CN Time Cheese',
  description: 'CN Timesheet',
};

const TimeSheetPage = () => {
  return <TimeSheetView />;
};

export default TimeSheetPage;
