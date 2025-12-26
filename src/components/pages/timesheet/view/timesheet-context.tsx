'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { format, isBefore, startOfDay } from 'date-fns';

import { fetcher } from '@/lib/fetcher';
import { IOptions } from '@/types/dropdown';
import { DAYTASKSTATUS, PERIODCALENDAR } from '@/lib/constants/period-calendar';
import { ITimeSheetResponse, ITimeSheetUserInfoResponse } from '@/types/timesheet';

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
  dailySecondsMap: Map<string, number>;
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
  getDailyWorkSeconds: () => Map<string, number>;
  getDayStatus: (day: Date, dailyTaskMap: Map<string, number>) => DAYTASKSTATUS;
  isPastDay: (day: Date) => boolean;
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
  const EIGHT_HOURS = 8 * 60 * 60;

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

  const dailySecondsMap = useMemo(() => {
    const map = new Map<string, number>();

    tasks.forEach((task) => {
      const start = new Date(task.start_date);
      const end = new Date(task.end_date);

      end.setFullYear(start.getFullYear());
      end.setMonth(start.getMonth());
      end.setDate(start.getDate());

      const seconds = Math.max(
        0,
        (end.getTime() - start.getTime()) / 1000 - (task.exclude_seconds ?? 0)
      );

      const key = format(start, 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + seconds);
    });

    return map;
  }, [tasks]);

  const getDailyWorkSeconds = () => {
    const map = new Map<string, number>();

    tasks.forEach((task) => {
      const start = new Date(task.start_date);
      const end = new Date(task.end_date);

      end.setFullYear(start.getFullYear());
      end.setMonth(start.getMonth());
      end.setDate(start.getDate());

      const seconds = Math.max(
        0,
        (end.getTime() - start.getTime()) / 1000 - (task.exclude_seconds ?? 0)
      );

      const key = format(start, 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + seconds);
    });

    return map;
  };

  const isWeekend = (date: Date) => {
    const d = date.getDay();
    return d === 0 || d === 6;
  };

  const getDayStatus = (day: Date) => {
    if (isWeekend(day)) return DAYTASKSTATUS.IGNORE;

    const key = format(day, 'yyyy-MM-dd');
    const seconds = dailySecondsMap.get(key) ?? 0;

    if (seconds === 0) return DAYTASKSTATUS.NOTASK;
    if (seconds < EIGHT_HOURS) return DAYTASKSTATUS.INPROGRESS;

    return DAYTASKSTATUS.COMPLETED;
  };

  const isPastDay = (day: Date) => {
    const today = startOfDay(new Date());
    return isBefore(startOfDay(day), today);
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
        dailySecondsMap,
        isPastDay,
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
        getDailyWorkSeconds,
        getDayStatus,
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
