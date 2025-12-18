import { TimeSheetView } from '@/components/pages/timesheet';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time Sheet - CN Timesheet',
  description: 'CN Timesheet',
};

const TimeSheetPage = () => {
  return <TimeSheetView />;
};

export default TimeSheetPage;
