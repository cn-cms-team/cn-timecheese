'use client';
import { PERIODCALENDAR } from '@/lib/constants/period-calendar';
import { ITimeSheetResponse } from '@/types/timesheet';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

interface ITimeSheetContextType {
  loading: boolean;
  period: PERIODCALENDAR;
  selectedCalendar: number | null;
  tasks: ITimeSheetResponse[];
  isPopoverEdit: boolean;
  setLoading: (isLoading: boolean) => void;
  setPeriod: (value: PERIODCALENDAR) => void;
  setSelectedCalendar: Dispatch<SetStateAction<number | null>>;
  setIsPopoverEdit: Dispatch<SetStateAction<boolean>>;
  resetSelectCaledar: () => void;
}

interface ITimeSheetProviderProps {
  children: ReactNode;
}

const TimeSheetContext = createContext<ITimeSheetContextType | undefined>(undefined);

const TimeSheetProvider = ({ children }: ITimeSheetProviderProps) => {
  const mockTimeSheetResponse: ITimeSheetResponse[] = [
    {
      id: 'ts_001',
      project_id: 'proj_01',
      project_name: 'Internal System Upgrade',
      task_type_id: 'task_01',
      task_type_name: 'Development',
      start_date: '2025-12-22T09:00:00.000Z',
      end_date: '2025-12-22T11:30:00.000Z',
      detail: 'Implement authentication flow and API integration',
      remark: 'Worked on login and session handling',
      created_at: '2025-12-21T11:35:00.000Z',
    },
    {
      id: 'ts_002',
      project_id: 'proj_02',
      project_name: 'Client Website Revamp',
      task_type_id: 'task_02',
      task_type_name: 'UI/UX Design',
      start_date: '2025-12-22T13:00:00.000Z',
      end_date: '2025-12-22T15:45:00.000Z',
      detail: 'Redesign landing page layout and responsive components',
      remark: 'Mobile-first approach applied',
      created_at: '2025-12-21T15:50:00.000Z',
    },
  ];
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(PERIODCALENDAR.WEEK);
  const [selectedCalendar, setSelectedCalendar] = useState<number | null>(null);
  const [tasks, setTasks] = useState<ITimeSheetResponse[]>(mockTimeSheetResponse);
  const [isPopoverEdit, setIsPopoverEdit] = useState(false);

  const resetSelectCaledar = () => {
    setSelectedCalendar(null);
  };

  return (
    <TimeSheetContext.Provider
      value={{
        loading,
        selectedCalendar,
        period,
        tasks,
        isPopoverEdit,
        setIsPopoverEdit,
        setLoading,
        setPeriod,
        setSelectedCalendar,
        resetSelectCaledar,
      }}
    >
      {children}
    </TimeSheetContext.Provider>
  );
};

export const useTimeSheetContext = () => {
  const context = useContext(TimeSheetContext);
  if (!context) {
    throw new Error('useTimeSheetContext must be used within TimeSheetProvider');
  }
  return context;
};

export default TimeSheetProvider;
