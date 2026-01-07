'use client';

import { ApexOptions } from 'apexcharts';
import { createContext, useContext, useState } from 'react';

import { fetcher } from '@/lib/fetcher';
import { IOption } from '@/types/option';
import { IDashboard } from '@/types/report';
import { formatDate } from '@/lib/functions/date-format';

interface IDashboardContextType {
  loading: boolean;
  monthOption: IOption[];
  barchartOption: ApexOptions;
  selectedMonth: number;
  projectId: string;
  dashboardProjectData: IDashboard;
  projectOption: IOption[];
  setSelectedMonth: (month: number) => void;
  setLoading: (loading: boolean) => void;
  setProjectId: (projectId: string) => void;
  setDashboardProjectData: (data: IDashboard) => void;
  fetchProjectData: (userId: string, projectId: string) => Promise<void>;
  fetchProjectsOption: () => Promise<void>;
}

const DashboardContext = createContext<IDashboardContextType | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const today = new Date();
  const prefix = process.env.NEXT_PUBLIC_APP_URL;

  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardProjectData, setDashboardProjectData] = useState<IDashboard>(null!);
  const [projectOption, setProjectOptions] = useState<IOption[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [projectId, setProjectId] = useState<string>(null!);
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

  const fetchProjectData = async (userId: string, projectId: string) => {
    setLoading(true);
    try {
      const dashboardData = await fetcher<IDashboard>(
        `${prefix}/api/v1/dashboard?project_id=${projectId}&member_id=${userId}`
      );

      setDashboardProjectData(dashboardData);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
    setLoading(false);
  };

  const fetchProjectsOption = async () => {
    try {
      const project = await fetcher<IOption[]>(`${prefix}//api/v1/report/project/project-list`);
      setProjectOptions(project);
      setProjectId((project[0]?.value as string) || '');
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        loading,
        barchartOption,
        monthOption,
        selectedMonth,
        projectId,
        dashboardProjectData,
        projectOption,
        setSelectedMonth,
        setProjectId,
        setLoading,
        setDashboardProjectData,
        fetchProjectData,
        fetchProjectsOption,
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
