'use client';
import { PERIODCALENDAR } from '@/lib/constants/period-calendar';
import { fetcher } from '@/lib/fetcher';
import { IOptions } from '@/types/dropdown';
import { ITimeSheetResponse, ITimeSheetUserInfoResponse } from '@/types/timesheet';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ITimeSheetContextType {
  loading: boolean;
  period: PERIODCALENDAR;
  selectedCalendar: Date | null;
  tasks: ITimeSheetResponse[];
  isPopoverEdit: boolean;
  selectedMonth: Date;
  selectedYear: number;
  projectOptions: IOptions[];
  taskTypeOptions: IOptions[];
  userInfo: ITimeSheetUserInfoResponse | null;
  setLoading: (isLoading: boolean) => void;
  setPeriod: (value: PERIODCALENDAR) => void;
  setSelectedCalendar: Dispatch<SetStateAction<Date>>;
  setIsPopoverEdit: Dispatch<SetStateAction<boolean>>;
  resetSelectCaledar: () => void;
  setSelectedMonth: Dispatch<SetStateAction<Date>>;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  setTasks: Dispatch<SetStateAction<ITimeSheetResponse[]>>;
  fetchOptions: () => void;
  buildTimesheetQuery: () => string;
  getUserInfo: () => Promise<void>;
  getTask: () => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

interface ITimeSheetProviderProps {
  children: ReactNode;
}

const TimeSheetContext = createContext<ITimeSheetContextType | undefined>(undefined);

const TimeSheetProvider = ({ children }: ITimeSheetProviderProps) => {
  const now = new Date();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(PERIODCALENDAR.WEEK);
  const [selectedCalendar, setSelectedCalendar] = useState<Date>(now);
  const [tasks, setTasks] = useState<ITimeSheetResponse[]>([]);
  const [isPopoverEdit, setIsPopoverEdit] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(selectedCalendar);
  const [selectedYear, setSelectedYear] = useState<number>(selectedCalendar.getFullYear());
  const [projectOptions, setProjectOptions] = useState<IOptions[]>([]);
  const [taskTypeOptions, setTaskTypeOptions] = useState<IOptions[]>([]);
  const [userInfo, setUserInfo] = useState<ITimeSheetUserInfoResponse | null>(null);

  const resetSelectCaledar = () => {
    setSelectedCalendar(now);
  };

  const fetchOptions = async () => {
    try {
      const prefix = process.env.NEXT_PUBLIC_APP_URL;
      const [projectOptions, taskTypeOptions] = await Promise.all([
        fetcher<IOptions[]>(`${prefix}/api/v1/master/project`),
        fetcher<IOptions[]>(`${prefix}/api/v1/master/task-type`),
      ]);
      setProjectOptions(projectOptions);
      setTaskTypeOptions(taskTypeOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const buildTimesheetQuery = () => {
    const params = new URLSearchParams();

    params.set('period', period);

    if (period === PERIODCALENDAR.WEEK && selectedCalendar) {
      params.set('date', selectedCalendar.toISOString());
    }

    if (period === PERIODCALENDAR.MONTH) {
      params.set('year', String(selectedYear));
      params.set('month', String(selectedMonth.getMonth()));
    }

    return params.toString();
  };

  const getUserInfo = async () => {
    const prefix = process.env.NEXT_PUBLIC_APP_URL;

    const res = await fetch(`${prefix}/api/v1/timesheet/user-info`);
    const json = await res.json();
    const data = json.data as ITimeSheetUserInfoResponse;

    if (!res.ok) {
      throw new Error('Failed to fetch user info');
    }

    setUserInfo(data);
  };

  const getTask = async () => {
    const prefix = process.env.NEXT_PUBLIC_APP_URL;
    const query = buildTimesheetQuery();

    const res = await fetch(`${prefix}/api/v1/timesheet?${query}`);
    const json = await res.json();
    const data = json.data as ITimeSheetResponse[];

    if (!res.ok) {
      throw new Error('Failed to fetch tasks data');
    }

    setTasks(data);
  };

  const deleteTask = async (taskId: string) => {
    const prefix = process.env.NEXT_PUBLIC_APP_URL;

    const res = await fetch(`${prefix}/api/v1/timesheet/${taskId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete task');
    }

    await getTask();
  };

  useEffect(() => {
    getTask();
  }, [period, selectedCalendar, selectedMonth, selectedYear]);

  return (
    <TimeSheetContext.Provider
      value={{
        loading,
        selectedCalendar,
        period,
        tasks,
        isPopoverEdit,
        selectedMonth,
        selectedYear,
        projectOptions,
        taskTypeOptions,
        userInfo,
        setIsPopoverEdit,
        setLoading,
        setPeriod,
        setSelectedCalendar,
        setTasks,
        resetSelectCaledar,
        setSelectedMonth,
        setSelectedYear,
        fetchOptions,
        buildTimesheetQuery,
        getTask,
        deleteTask,
        getUserInfo,
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
