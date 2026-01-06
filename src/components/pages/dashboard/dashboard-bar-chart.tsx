'use client';

import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { useDashboardContext } from './view/dashboard-use-context';
import Dropdown from '@/components/ui/custom/input/dropdown';

const DashboardBarChart = () => {
  const { barchartOption, monthOption, selectedMonth, setSelectedMonth } = useDashboardContext();
  const handleSelectMonth = (month: number) => {
    if (setSelectedMonth) {
      setSelectedMonth(month);
    }
  };

  return (
    <div className="w-full border rounded-md p-3">
      <header>
        <h2 className="text-base font-semibold">การลงเวลางาน</h2>
      </header>
      <main className="mt-2 grid grid-cols-1 overflow-hidden">
        <div>
          <Dropdown
            className="max-w-xs ms-4"
            options={monthOption}
            value={selectedMonth}
            canEmpty={false}
            isAllPlaceHolder={false}
            placeholder="เลือกเดือน"
            onChange={(value) => handleSelectMonth(Number(value))}
          />
        </div>
        <div className="min-w-150 overflow-x-auto">
          <ApexChart options={barchartOption} type="bar" height={300} />
        </div>
      </main>
    </div>
  );
};

export default DashboardBarChart;
