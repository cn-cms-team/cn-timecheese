'use client';

import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { useDashboardContext } from './view/dashboard-use-context';

const DashboardDonutChart = () => {
  const { donutChartOption } = useDashboardContext();
  return (
    <div className="w-full mt-4 border rounded-md p-3">
      <header></header>
      <main className="grid lg:grid-cols-2 grid-cols-1">
        <ApexChart options={donutChartOption} type="donut" height={300} />
        <div className="w-full py-4">
          <h3 className="font-semibold">ประเภทงาน</h3>
          <div className="grid grid-cols-2">{/* ประเภทงาน */}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardDonutChart;
