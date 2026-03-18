'use client';
import { useMemo } from 'react';
import Image from 'next/image';
import { ApexOptions } from 'apexcharts';

import { ITimeSheetDonutChart } from '@/types/report';

import ApexChart from '../chart/apex-chart';
import { formatTotalHours } from '@/lib/functions/timesheet-manage';

interface IProps {
  donutHeight?: number;
  donutLabel?: ITimeSheetDonutChart[];
  loading?: boolean;
}

const DonutChartTimesheet = ({ donutLabel = [], donutHeight = 300, loading = false }: IProps) => {
  const data = useMemo(() => {
    const totalHours = donutLabel.reduce((acc, curr) => acc + curr.tracked_hours, 0);
    const series = donutLabel.map((item) => item.tracked_hours);
    const label = donutLabel.map((item) => {
      const trackedHours = item.tracked_hours;
      const percentage =
        totalHours > 0 ? `${((trackedHours / totalHours) * 100).toFixed(1)}%` : '0.0%';
      const duration = formatTotalHours(trackedHours);

      return {
        percentage,
        task_name: item.task_type,
        duration,
      };
    });

    return { series, label };
  }, [donutLabel]);

  const donutChartOption: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: data.label.map((item) => item.task_name),
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          const formattedDuration = formatTotalHours(val);
          return formattedDuration;
        },
      },
    },
  };

  return (
    <>
      {loading ? (
        <div className="w-full border rounded-md p-3">
          <div className="animate-pulse bg-gray-200 h-64 rounded-lg col-span-2 shadow"></div>
        </div>
      ) : (
        <div className="w-full border rounded-md p-3 shadow">
          {donutLabel.length === 0 ? (
            <Image
              src="/img/general/md-no-data.png"
              width={150}
              height={150}
              alt="Nodata"
              className="mx-auto opacity-80"
            />
          ) : (
            <>
              <div className="text-base font-semibold mb-4">สัดส่วนงาน</div>
              <main className="max-w-150 mx-auto">
                <ApexChart
                  options={donutChartOption}
                  series={data.series}
                  type="donut"
                  height={donutHeight}
                />
              </main>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default DonutChartTimesheet;
