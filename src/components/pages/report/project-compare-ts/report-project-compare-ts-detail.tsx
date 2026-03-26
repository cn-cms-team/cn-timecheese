'use client';

import { useEffect, useMemo, useState } from 'react';
import { ApexOptions } from 'apexcharts';

import ApexChart from '@/components/ui/custom/chart/apex-chart';
import Dropdown from '@/components/ui/custom/input/dropdown';
import { Label } from '@/components/ui/label';
import { monthOption } from '@/lib/constants/period-calendar';
import { fetcher } from '@/lib/fetcher';
import { IReportProjectCompareTsItem } from '@/types/report';

const ReportProjectCompareTsDetail = () => {
  const today = new Date();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<IReportProjectCompareTsItem[]>([]);

  const yearOption = Array.from({ length: 5 }, (_, i) => ({
    label: String(today.getFullYear() - i),
    value: today.getFullYear() - i,
  }));

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher<IReportProjectCompareTsItem[]>(
          `${appUrl}/api/v1/report/project-compare-ts?month=${selectedMonth}&year=${selectedYear}`
        );

        if (!cancelled) {
          setRows(response);
        }
      } catch (error) {
        console.error('Error fetching compare project timesheet data:', error);
        if (!cancelled) {
          setRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [appUrl, selectedMonth, selectedYear]);

  const chartLoading = loading;

  const projectLabels = useMemo(
    () =>
      rows.map((item) =>
        item.project_code ? `[${item.project_code}] ${item.project_name}` : item.project_name
      ),
    [rows]
  );

  const barSeries = useMemo(
    () => [
      {
        name: 'ชั่วโมงรวม',
        data: rows.map((item) => item.total_hours),
      },
    ],
    [rows]
  );

  const barOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          borderRadiusApplication: 'end',
          barHeight: '60%',
        },
      },
      xaxis: {
        categories: projectLabels,
        title: {
          text: 'Man-Day',
        },
        labels: {
          formatter: (value) => Number(value).toFixed(1),
        },
      },
      yaxis: {
        title: {
          text: 'ชื่อโครงการ',
        },
        labels: {
          maxWidth: 280,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (value) => `${Number(value).toFixed(1)} ชม. (${getManDayText(Number(value))})`,
        style: {
          fontWeight: 700,
        },
      },
      colors: ['#0ea5e9'],
      grid: {
        borderColor: '#e2e8f0',
      },
      tooltip: {
        y: {
          formatter: (value) => getManDayAndHourText(Number(value)),
        },
      },
    }),
    [projectLabels]
  );

  const getManDayAndHourText = (hours: number) => {
    if (!hours) {
      return '0 ชั่วโมง';
    }
    const manDays = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    return `${manDays > 0 ? `${manDays} วัน` : ''} ${remainingHours.toFixed(1)} ชั่วโมง`;
  };

  const getManDayText = (hours: number) => {
    if (!hours) {
      return '0 วัน';
    }
    const manDays = hours / 8;
    return `~${manDays.toFixed(0)} วัน`;
  };

  const chartHeight = Math.max(360, rows.length * 56);

  return (
    <div className="w-full border rounded-md p-3 shadow-sm">
      <header>
        <h2 className="text-base font-semibold mb-4">เปรียบเทียบชั่วโมง TS ระหว่างโครงการ</h2>
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
              value={selectedYear}
              options={yearOption}
              canEmpty={false}
              isAllPlaceHolder={false}
              placeholder="เลือกปี"
              onChange={(value) => setSelectedYear(Number(value))}
            />
          </div>
        </div>
      </header>

      <main className="mt-4 grid grid-cols-1 gap-4">
        {chartLoading ? (
          <div className="w-full h-80 bg-gray-300 animate-pulse rounded-lg" />
        ) : rows.length === 0 ? (
          <div className="w-full h-80 border rounded-lg flex items-center justify-center text-muted-foreground">
            ไม่พบข้อมูลในเดือนที่เลือก
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-200 pt-6">
              <ApexChart options={barOptions} series={barSeries} type="bar" height={chartHeight} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportProjectCompareTsDetail;
