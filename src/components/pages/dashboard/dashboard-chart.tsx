'use client';

import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { useDashboardContext } from './view/dashboard-use-context';
import Dropdown from '@/components/ui/custom/input/dropdown';

const DashboardChart = () => {
  const { chartOption, monthOption, selectedMonth, setSelectedMonth } = useDashboardContext();
  const handleSelectMonth = (month: number) => {
    if (setSelectedMonth) {
      setSelectedMonth(month);
    }
  };

  return (
    <div className="w-full">
      <header>
        <h2 className="text-base font-semibold">การลงเวลางาน</h2>
      </header>
      <main className="mt-2">
        <Dropdown
          className="max-w-xs ms-4"
          options={monthOption}
          value={selectedMonth}
          canEmpty={false}
          isAllPlaceHolder={false}
          placeholder="เลือกเดือน"
          onChange={(value) => handleSelectMonth(Number(value))}
        />
        <ApexChart options={chartOption} type="bar" height={300} />
      </main>
    </div>
  );
};

export default DashboardChart;
