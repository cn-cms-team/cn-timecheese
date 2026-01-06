'use client';

import { ApexOptions } from 'apexcharts';
import { createContext, useContext, useState } from 'react';

import { formatDate } from '@/lib/functions/date-format';
import { IOption } from '@/types/option';

interface IDashboardContextType {
  loading: boolean;
  monthOption: IOption[];
  barchartOption: ApexOptions;
  donutChartOption: ApexOptions;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

const DashboardContext = createContext<IDashboardContextType | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const loading = false;
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [weekAnchorDate, setWeekAnchorDate] = useState<Date>(() => {
    return new Date(today.getFullYear(), selectedMonth, today.getDate());
  });

  const daysInMonth = new Date(weekAnchorDate.getFullYear(), selectedMonth + 1, 0).getDate();

  const weekDays = Array.from({ length: daysInMonth }, (_, i) =>
    formatDate(new Date(weekAnchorDate.getFullYear(), selectedMonth, i + 1), 'd')
  );

  const monthOption = Array.from({ length: 12 }, (_, i) => ({
    label: formatDate(new Date(today.getFullYear(), i, 1), 'mmmm'),
    value: i,
  }));

  const barchartOption: ApexOptions = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: weekDays,
    },
    yaxis: {
      title: {
        text: 'ชั่วโมง',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return +val + ' ชั่วโมง';
        },
      },
    },
  };

  const donutChartOption: ApexOptions = {
    chart: {
      type: 'donut',
    },
    // labels: ['งานที่ทำเสร็จ', 'งานที่ค้างอยู่', 'งานที่ยังไม่เริ่ม'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <DashboardContext.Provider
      value={{
        loading,
        barchartOption,
        monthOption,
        selectedMonth,
        donutChartOption,
        setSelectedMonth,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context as IDashboardContextType;
};

export default DashboardProvider;
