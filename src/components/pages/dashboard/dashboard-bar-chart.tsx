'use client';
import { useEffect, useMemo, useState } from 'react';

import { fetcher } from '@/lib/fetcher';
import { IDashboardAttendance } from '@/types/dashboard';

import Dropdown from '@/components/ui/custom/input/dropdown';
import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { useDashboardContext } from './view/dashboard-use-context';
import { Label } from '@/components/ui/label';

const DashboardBarChart = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const {
    barchartOption,
    monthOption,
    selectedMonth,
    selectYear,
    yearOption,
    weekDays,
    setSelectYear,
    setSelectedMonth,
  } = useDashboardContext();

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
        <h2 className="text-base font-semibold mb-4">การลงเวลางาน</h2>
      </header>
      <main className="mt-2 grid grid-cols-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="space-y-1">
            <Label>เดือน</Label>
            <Dropdown
              className="max-w-md"
              value={selectedMonth}
              options={monthOption}
              canEmpty={false}
              isAllPlaceHolder={false}
              placeholder="เลือกเดือน"
              onChange={(value) => setSelectedMonth(Number(value))}
            />
          </div>
          <div className="space-y-1">
            <Label>ปี</Label>
            <Dropdown
              className="max-w-md"
              value={selectYear}
              options={yearOption}
              canEmpty={false}
              isAllPlaceHolder={false}
              placeholder="เลือกปี"
              onChange={(value) => setSelectYear(Number(value))}
            />
          </div>
        </div>
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
