'use client';

import { ApexOptions } from 'apexcharts';
import { createContext, useContext, useState } from 'react';

import { fetcher } from '@/lib/fetcher';
import { IDashboard } from '@/types/report';
import { IUserReport } from '@/types/report/team';
import { IOptionGroups } from '@/types/dropdown';
import { DD_PROJECT_LABEL } from '@/lib/constants/dropdown';

interface IDashboardContextType {
  loading: boolean;
  projectId: string;
  dashboardProjectData: IDashboard;
  projectOption: IOptionGroups[];
  userInfo: IUserReport;
  setLoading: (loading: boolean) => void;
  setProjectId: (projectId: string) => void;
  setDashboardProjectData: (data: IDashboard) => void;
  fetchProjectData: (userId: string, projectId: string) => Promise<void>;
  fetchProjectsOption: () => Promise<void>;
  fetchUserInfo: (userId: string) => Promise<void>;
}

const DashboardContext = createContext<IDashboardContextType | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IUserReport>(null!);
  const [dashboardProjectData, setDashboardProjectData] = useState<IDashboard>(null!);
  const [projectOption, setProjectOptions] = useState<IOptionGroups[]>([]);
  const [projectId, setProjectId] = useState<string>(null!);

  const fetchUserInfo = async (userId: string) => {
    try {
      setLoading(true);
      const userInfo = await fetcher<IUserReport>(`${prefix}/api/v1/dashboard/user-info`);

      setUserInfo(userInfo);
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectData = async (userId: string, projectId: string) => {
    try {
      setLoading(true);
      const dashboardData = await fetcher<IDashboard>(
        `${prefix}/api/v1/dashboard?project_id=${projectId}&member_id=${userId}`
      );

      setDashboardProjectData(dashboardData);
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsOption = async () => {
    try {
      const project = await fetcher<IOptionGroups[]>(`${prefix}/api/v1/dashboard/master/project`);
      setProjectOptions(project);
      if (!projectId) {
        const defaultProject = project.find((e) => e.label === DD_PROJECT_LABEL);

        if (defaultProject) setProjectId((defaultProject.options[0].value as string) || '');
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        loading,
        projectId,
        dashboardProjectData,
        projectOption,
        userInfo,
        setProjectId,
        setLoading,
        setDashboardProjectData,
        fetchProjectData,
        fetchProjectsOption,
        fetchUserInfo,
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
