import { ReportProjectCompareTsView } from '@/components/pages/report/project-compare-ts/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report Project Compare TS - Time Cheese',
  description: 'Time Cheese',
};

const ReportProjectCompareTs = () => {
  return <ReportProjectCompareTsView />;
};

export default ReportProjectCompareTs;
