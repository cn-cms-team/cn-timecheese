'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ApexOptions } from 'apexcharts';

import { fetcher } from '@/lib/fetcher';
import { monthOption } from '@/lib/constants/period-calendar';
import { formatTotalHours } from '@/lib/functions/timesheet-manage';
import { IReportProjectAttendance } from '@/types/report';

import Dropdown from '@/components/ui/custom/input/dropdown';
import ApexChart from '@/components/ui/custom/chart/apex-chart';
import { Label } from '@/components/ui/label';

type IReportProjectBarChartProps = {
  projectId: string;
  isLoading: boolean;
};

const ReportProjectBarChart = ({ projectId, isLoading }: IReportProjectBarChartProps) => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectYear, setSelectYear] = useState<number>(today.getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IReportProjectAttendance[]>([]);

  const yearOption = Array.from({ length: 3 }, (_, i) => ({
    label: (today.getFullYear() - i).toString(),
    value: today.getFullYear() - i,
  }));

  const days = useMemo(() => {
    const dayCount = new Date(selectYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: dayCount }, (_, i) => String(i + 1));
  }, [selectedMonth, selectYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetcher<IReportProjectAttendance[]>(
          `${prefix}/api/v1/report/project/${projectId}/attendance?month=${selectedMonth}&year=${selectYear}`
        );
        setData(result);
      } catch (error) {
        console.error('Error fetching project attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
      return;
    }

    setData([]);
  }, [projectId, selectedMonth, selectYear]);

  const series = useMemo(() => {
    const mappedData = Array(days.length).fill(0);

    data.forEach((item) => {
      const dayIndex = new Date(item.date).getDate() - 1;
      const totalSeconds = item.series.reduce(
        (sum, seriesItem) => sum + Number(seriesItem.data || 0),
        0
      );
      mappedData[dayIndex] = totalSeconds / 3600;
    });

    return [
      {
        name: 'รวมทั้งโครงการ',
        data: mappedData,
      },
    ];
  }, [data, days.length]);

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
          return `วันที่ ${days[dataIndex]} : ${formatTotalHours(value)}`;
        },
      },
    },
  };

  const chartLoading = isLoading || loading;

  return (
    <div className="w-full border rounded-md p-3 shadow-sm mt-3">
      <header>
        <h2 className="text-base font-semibold mb-4">การลงเวลางานรวมทั้งโครงการ</h2>
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
        {chartLoading ? (
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

export default React.memo(ReportProjectBarChart);
