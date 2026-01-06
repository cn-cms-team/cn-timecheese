'use client';

import DashboardBarChart from './dashboard-bar-chart';
import DashboardDonutChart from './dashboard-donut-chart';

const DashboardContent = () => {
  return (
    <div className="w-full">
      <DashboardBarChart />
      <DashboardDonutChart />
    </div>
  );
};

export default DashboardContent;
