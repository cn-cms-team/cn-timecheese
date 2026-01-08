'use client';
import { useMemo } from 'react';
import Image from 'next/image';
import { ApexOptions } from 'apexcharts';

import { ITimeSheetDonutChart } from '@/types/report';

import ApexChart from '../chart/apex-chart';

interface IProps {
  donutHeight?: number;
  donutLabel?: ITimeSheetDonutChart[];
  loading?: boolean;
}

const DonutChartTimesheet = ({ donutLabel = [], donutHeight = 300, loading = false }: IProps) => {
  const formatHours = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const duration = `${hours} ชม. ${
      minutes > 0 ? `${minutes.toString().padStart(2, '0')} น.` : ''
    } `;

    return duration;
  };

  const data = useMemo(() => {
    const totalHours = donutLabel.reduce((acc, curr) => acc + curr.tracked_hours, 0);
    const series = donutLabel.map((item) => item.tracked_hours);
    const label = donutLabel.map((item) => {
      const trackedHours = item.tracked_hours;
      const percentage =
        totalHours > 0 ? `${((trackedHours / totalHours) * 100).toFixed(1)}%` : '0.0%';
      const duration = formatHours(trackedHours);

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
          const formattedDuration = formatHours(val);
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
        <div className="w-full border rounded-md p-3">
          {donutLabel.length === 0 ? (
            <Image
              src="/img/general/md-no-data.png"
              width={150}
              height={150}
              alt="Nodata"
              className="mx-auto"
            />
          ) : (
            <>
              <div className="text-base font-semibold mb-4">สัดส่วนงาน</div>
              <main className="flex justify-center  gap-4 ">
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
