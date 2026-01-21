'use client';

import { ApexOptions } from 'apexcharts';
import { createContext, useContext, useState } from 'react';

import { fetcher } from '@/lib/fetcher';
import { IOption } from '@/types/option';
import { IDashboard } from '@/types/report';
import { IReportTeam } from '@/types/report/team';
import { weekDays } from '@/lib/constants/period-calendar';
import { useLoading } from '@/components/context/app-context';

interface IDashboardContextType {
  loading: boolean;
  barchartOption: ApexOptions;
  selectedMonth: number;
  projectId: string;
  dashboardProjectData: IDashboard;
  projectOption: IOption[];
  yearOption: IOption[];
  selectYear: number;
  userInfo: IReportTeam;
  setSelectedMonth: (month: number) => void;
  setLoading: (loading: boolean) => void;
  setProjectId: (projectId: string) => void;
  setDashboardProjectData: (data: IDashboard) => void;
  fetchProjectData: (userId: string, projectId: string) => Promise<void>;
  fetchProjectsOption: () => Promise<void>;
  fetchUserInfo: (userId: string) => Promise<void>;
  formatHours: (seconds: number) => string;
  setSelectYear: (year: number) => void;
}

const DashboardContext = createContext<IDashboardContextType | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const today = new Date();
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const { setIsLoading } = useLoading();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IReportTeam>(null!);
  const [selectYear, setSelectYear] = useState<number>(today.getFullYear());
  const [dashboardProjectData, setDashboardProjectData] = useState<IDashboard>(null!);
  const [projectOption, setProjectOptions] = useState<IOption[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [projectId, setProjectId] = useState<string>(null!);

  const formatHours = (hours: number) => {
    const minutes = Math.floor((hours % 3600) / 60);

    const duration = `${hours} ชม ${
      minutes === 0 ? '' : minutes.toString().padStart(2, '0') + 'น'
    } `;

    return duration;
  };

  const days = weekDays(selectedMonth);

  const userStartDate = userInfo?.user?.start_date;

  const yearOption = Array.from(
    { length: today.getFullYear() - new Date(userStartDate).getFullYear() + 1 },
    (_, i) => ({
      label: (new Date(userStartDate).getFullYear() + i).toString(),
      value: new Date(userStartDate).getFullYear() + i,
    })
  );

  const barchartOption: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        borderRadius: 4,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
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
          return `วันที่ ${days[dataIndex]}: ${formatHours(value)}`;
        },
      },
    },
  };

  const fetchUserInfo = async (userId: string) => {
    try {
      setLoading(true);
      setIsLoading(true);
      const userInfo = await fetcher<IReportTeam>(`${prefix}/api/v1/report/team?user_id=${userId}`);

      setUserInfo(userInfo);
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const fetchProjectData = async (userId: string, projectId: string) => {
    try {
      setLoading(true);
      setIsLoading(true);
      const dashboardData = await fetcher<IDashboard>(
        `${prefix}/api/v1/dashboard?project_id=${projectId}&member_id=${userId}`
      );

      setDashboardProjectData(dashboardData);
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const fetchProjectsOption = async () => {
    try {
      const project = await fetcher<IOption[]>(`${prefix}/api/v1/report/project/project-list`);
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
        selectedMonth,
        projectId,
        dashboardProjectData,
        projectOption,
        yearOption,
        selectYear,
        userInfo,
        setSelectYear,
        setSelectedMonth,
        setProjectId,
        setLoading,
        setDashboardProjectData,
        fetchProjectData,
        fetchProjectsOption,
        fetchUserInfo,
        formatHours,
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
