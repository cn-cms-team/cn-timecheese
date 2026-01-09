'use client';
import { useEffect, useMemo, useState } from 'react';

import { fetcher } from '@/lib/fetcher';
import { IDashboardAttendance } from '@/types/dashboard';
import { monthOption, weekDays } from '@/lib/constants/period-calendar';

import Dropdown from '@/components/ui/custom/input/dropdown';
import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { useDashboardContext } from './view/dashboard-use-context';
import { Label } from '@/components/ui/label';

const DashboardBarChart = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const { barchartOption, selectedMonth, selectYear, yearOption, setSelectYear, setSelectedMonth } =
    useDashboardContext();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IDashboardAttendance[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetcher<IDashboardAttendance[]>(
        `${prefix}/api/v1/dashboard/attendance?month=${selectedMonth}&year=${selectYear}`
      );

      setData(res);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth === null) return;

    fetchData();
  }, [selectedMonth, selectYear]);

  const series = useMemo(() => {
    const dateMap = new Map(
      data.map((item) => [new Date(item.date).getDate(), item.total_seconds])
    );

    return [
      {
        data: weekDays(selectedMonth).map((day) => {
          const totalSeconds = dateMap.get(Number(day));
          return totalSeconds ? totalSeconds / 3600 : 0;
        }),
      },
    ];
  }, [data, weekDays]);

  return (
    <div className="w-full border rounded-md p-3 shadow-sm">
      <header>
        <h2 className="text-base font-semibold mb-4">การลงเวลางาน</h2>
        <div className="flex md:flex-row flex-col gap-2 w-full">
          <div className="space-y-1 md:w-xs w-full">
            <Label>เดือน</Label>
            <Dropdown
              className="w-full"
              value={selectedMonth}
              options={monthOption}
              canEmpty={false}
              isAllPlaceHolder={false}
              placeholder="เลือกเดือน"
              onChange={(value) => setSelectedMonth(Number(value))}
            />
          </div>
          <div className="space-y-1 md:w-xs w-full">
            <Label>ปี</Label>
            <Dropdown
              className="w-full"
              value={selectYear}
              options={yearOption}
              canEmpty={false}
              isAllPlaceHolder={false}
              placeholder="เลือกปี"
              onChange={(value) => setSelectYear(Number(value))}
            />
          </div>
        </div>
      </header>
      <main className="mt-2 grid grid-cols-1 overflow-x-auto">
        {loading ? (
          <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg mt-4" />
        ) : (
          <div className="min-w-150 overflow-x-auto">
            <ApexChart options={barchartOption} series={series} type="bar" height={250} />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardBarChart;
