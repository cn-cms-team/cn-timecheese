'use client';
import React, { useEffect, useMemo, useState } from 'react';

import { ApexOptions } from 'apexcharts';
import { fetcher } from '@/lib/fetcher';
import { IDashboardAttendance, IDashboardAttendanceSeries } from '@/types/dashboard';
import { monthOption, weekDays } from '@/lib/constants/period-calendar';
import { formatTotalHours } from '@/lib/functions/timesheet-manage';

import Dropdown from '@/components/ui/custom/input/dropdown';
import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { Label } from '@/components/ui/label';

const DashboardBarChart = ({ userId }: { userId: string }) => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectYear, setSelectYear] = useState<number>(today.getFullYear());
  const days = weekDays(selectedMonth);

  const yearOption = Array.from({ length: 3 }, (_, i) => ({
    label: (today.getFullYear() - i).toString(),
    value: today.getFullYear() - i,
  }));

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IDashboardAttendance[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!userId) return;
      const res = await fetcher<IDashboardAttendance[]>(
        `${prefix}/api/v1/dashboard/attendance?month=${selectedMonth}&year=${selectYear}&user_id=${userId}`
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
  }, [selectedMonth, selectYear, userId]);

  const series = useMemo(() => {
    const series: Map<string, Array<number>> = new Map();
    data.forEach((item) => {
      item.series.forEach((s) => {
        if (!series.has(s.name)) {
          series.set(s.name, Array(weekDays(selectedMonth).length).fill(0));
        }
      });
    });
    data.forEach((item) => {
      item.series.forEach((s) => {
        series.get(s.name)![new Date(item.date).getDate() - 1] = s.data ? Number(s.data) / 3600 : 0;
      });
    });
    return Array.from(series.entries()).map(([name, data]) => ({
      name,
      data,
    }));
  }, [data, weekDays]);

  const barChartOption: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        borderRadius: 4,
        // distributed: true,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px',
        fontWeight: 700,
      },
      formatter: function (value) {
        return Number(value) % 1 === 0 ? Number(value) : Number(value).toFixed(2);
      },
    },
    legend: {
      position: 'bottom',
    },
    xaxis: {
      categories: days,
    },
    yaxis: {
      title: {
        text: 'ชั่วโมง',
      },
      forceNiceScale: false,
      tickAmount: 4,
      labels: {
        formatter: function (value) {
          return value.toFixed(0);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return '';
          },
        },
        formatter: function (value, option) {
          const dataIndex = option.dataPointIndex;
          return `วันที่ ${days[dataIndex]} ${option.w.config.series[option.seriesIndex].name} : ${formatTotalHours(value)}`;
        },
      },
    },
  };

  return (
    <div className="w-full border rounded-md p-3 shadow-sm">
      <header>
        <h2 className="text-base font-semibold mb-4">การลงเวลางาน</h2>
        <div className="flex md:flex-row flex-col gap-3 w-full">
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
            <ApexChart options={barChartOption} series={series} type="bar" height={250} />
          </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(DashboardBarChart);
