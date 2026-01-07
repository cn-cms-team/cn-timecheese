'use client';
import { useEffect, useMemo, useState } from 'react';

import { fetcher } from '@/lib/fetcher';
import { IDashboardAttendance } from '@/types/dashboard';

import Dropdown from '@/components/ui/custom/input/dropdown';
import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { useDashboardContext } from './view/dashboard-use-context';

const DashboardBarChart = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const { barchartOption, monthOption, selectedMonth, weekDays, setSelectedMonth } =
    useDashboardContext();

  const [data, setData] = useState<IDashboardAttendance[]>([]);

  const handleSelectMonth = (month: number) => {
    if (setSelectedMonth) {
      setSelectedMonth(month);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetcher<IDashboardAttendance[]>(
        `${prefix}/api/v1/dashboard/attendance?month=${selectedMonth}`
      );

      setData(res);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedMonth === null) return;

    fetchData();
  }, [selectedMonth]);

  const series = useMemo(() => {
    const dateMap = new Map(
      data.map((item) => [new Date(item.date).getDate(), item.total_seconds])
    );

    return [
      {
        data: weekDays.map((day) => {
          const totalSeconds = dateMap.get(Number(day));
          return totalSeconds ? totalSeconds / 3600 : 0;
        }),
      },
    ];
  }, [data, weekDays]);

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
          <ApexChart options={barchartOption} series={series} type="bar" height={250} />
        </div>
      </main>
    </div>
  );
};

export default DashboardBarChart;
