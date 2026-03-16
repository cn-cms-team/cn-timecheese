'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { fetcher } from '@/lib/fetcher';
import { IOptionGroups } from '@/types/dropdown';

type TaskTypeOption = {
  value: string;
  label: string;
  description?: string;
};

type ProjectOption = {
  label: string;
  value: string;
  taskTypes: {
    label: string;
    options: TaskTypeOption[];
  }[];
};

type ProjectOptionGroup = {
  label: string;
  options: ProjectOption[];
};

type TimeSheetMasterContextType = {
  isProjectOptionsLoading: boolean;
  projectOptions: ProjectOptionGroup[];
  getTaskTypeOptionsByProjectId: (projectId?: string) => IOptionGroups[];
};

const TimeSheetMasterContext = createContext<TimeSheetMasterContextType | undefined>(undefined);

interface TimeSheetMasterProviderProps {
  children: ReactNode;
}

const TimeSheetMasterProvider = ({ children }: TimeSheetMasterProviderProps) => {
  const [isProjectOptionsLoading, setIsProjectOptionsLoading] = useState(false);
  const [projectOptions, setProjectOptions] = useState<ProjectOptionGroup[]>([]);

  useEffect(() => {
    const loadProjectOptions = async () => {
      try {
        setIsProjectOptionsLoading(true);
        const data = await fetcher<ProjectOptionGroup[]>('/api/v1/timesheets/master/projects');
        setProjectOptions(data);
      } catch (error) {
        console.error('Error fetching project options:', error);
      } finally {
        setIsProjectOptionsLoading(false);
      }
    };

    loadProjectOptions();
  }, []);

  const taskTypeOptionsByProjectId = useMemo(() => {
    const map = new Map<string, IOptionGroups[]>();

    projectOptions.forEach((group) => {
      group.options.forEach((project) => {
        map.set(project.value, project.taskTypes);
      });
    });

    return map;
  }, [projectOptions]);

  const contextValue = useMemo(
    () => ({
      isProjectOptionsLoading,
      projectOptions,
      getTaskTypeOptionsByProjectId: (projectId?: string) => {
        if (!projectId) {
          return [];
        }

        return taskTypeOptionsByProjectId.get(projectId) ?? [];
      },
    }),
    [isProjectOptionsLoading, projectOptions, taskTypeOptionsByProjectId]
  );

  return (
    <TimeSheetMasterContext.Provider value={contextValue}>
      {children}
    </TimeSheetMasterContext.Provider>
  );
};

const useTimeSheetMasterContext = () => {
  const context = useContext(TimeSheetMasterContext);

  if (!context) {
    throw new Error('useTimeSheetMasterContext must be used within TimeSheetMasterProvider');
  }

  return context;
};

export { TimeSheetMasterProvider, useTimeSheetMasterContext };
