'use client';

import { useDashboardContext } from './view/dashboard-use-context';

import DashboardBarChart from './dashboard-bar-chart';
import DonutChartTimesheet from '@/components/ui/custom/report/donut-chart-timesheet';

const DashboardContent = () => {
  const { donutChartOption } = useDashboardContext();

  return (
    <div className="w-full">
      <DashboardBarChart />
      <DonutChartTimesheet chartOption={donutChartOption} />
    </div>
  );
};

export default DashboardContent;
