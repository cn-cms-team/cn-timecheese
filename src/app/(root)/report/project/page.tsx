import ReportProjectView from '@/components/pages/report/project/view/report-project-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report Project - Time Cheese',
  description: 'Time Cheese',
};

const ReportProjectStatus = () => {
  return <ReportProjectView />;
};

export default ReportProjectStatus;
