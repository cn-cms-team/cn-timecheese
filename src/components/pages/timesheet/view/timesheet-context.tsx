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
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { addDays, addWeeks, format, isBefore, startOfDay, startOfWeek } from 'date-fns';

import { fetcher } from '@/lib/fetcher';
import { IOptionGroups, IOptions } from '@/types/dropdown';
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
  taskTypeOptions: IOptionGroups[];
  userInfo: ITimeSheetUserInfoResponse | null;
  dailySecondsMap: Map<string, number>;
  weekDays: Date[];
  setLoading: (isLoading: boolean) => void;
  setPeriod: (value: PERIODCALENDAR) => void;
  setSelectedCalendar: Dispatch<SetStateAction<Date>>;
  setIsPopoverEdit: Dispatch<SetStateAction<boolean>>;
  resetSelectCaledar: () => void;
  setSelectedMonth: Dispatch<SetStateAction<Date>>;
  setSelectedYear: Dispatch<SetStateAction<number>>;
  setTasks: Dispatch<SetStateAction<ITimeSheetResponse[]>>;
  fetchOptions: () => void;
  fetchTaskOption: (projectId: string) => Promise<void>;
  buildTimesheetQuery: () => string;
  getUserInfo: () => Promise<void>;
  getTask: () => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getDailyWorkSeconds: () => Map<string, number>;
  getDayStatus: (day: Date, dailyTaskMap: Map<string, number>) => DAYTASKSTATUS;
  isPastDay: (day: Date) => boolean;
  setWeekAnchorDate: Dispatch<SetStateAction<Date>>;
}

interface ITimeSheetProviderProps {
  children: ReactNode;
}

const TimeSheetContext = createContext<ITimeSheetContextType | undefined>(undefined);

const TimeSheetProvider = ({ children }: ITimeSheetProviderProps) => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const { data: session } = useSession();
  const now = new Date();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(PERIODCALENDAR.WEEK);
  const [selectedCalendar, setSelectedCalendar] = useState<Date>(now);
  const [tasks, setTasks] = useState<ITimeSheetResponse[]>([]);
  const [isPopoverEdit, setIsPopoverEdit] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(selectedCalendar);
  const [selectedYear, setSelectedYear] = useState<number>(selectedCalendar.getFullYear());
  const [projectOptions, setProjectOptions] = useState<IOptions[]>([]);
  const [taskTypeOptions, setTaskTypeOptions] = useState<IOptionGroups[]>([]);
  const [userInfo, setUserInfo] = useState<ITimeSheetUserInfoResponse | null>(null);
  const EIGHT_HOURS = 8 * 60 * 60;

  const [weekAnchorDate, setWeekAnchorDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(selectedYear, selectedMonth.getMonth(), today.getDate());
  });

  const start = startOfWeek(weekAnchorDate, { weekStartsOn: 0 });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const resetSelectCaledar = () => {
    setSelectedCalendar(now);
  };

  const fetchOptions = async () => {
    try {
      const projectOptions = await fetcher<IOptions[]>(
        `${prefix}/api/v1/master/project${session?.user?.id ? `?user_id=${session.user.id}` : ''}`
      );
      setProjectOptions(projectOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchTaskOption = async (projectId: string) => {
    try {
      if (!projectId) {
        setTaskTypeOptions([]);
        return;
      }

      const res = await fetch(`${prefix}/api/v1/master/task-type/${projectId}`);
      const json = await res.json();
      const data = json.data as IOptionGroups[];

      console.log(data);

      setTaskTypeOptions(data);
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
    try {
      setLoading(true);
      const prefix = process.env.NEXT_PUBLIC_APP_URL;

      const res = await fetch(`${prefix}/api/v1/timesheet/user-info`);
      const json = await res.json();
      const data = json.data as ITimeSheetUserInfoResponse;

      if (!res.ok) {
        throw new Error('Failed to fetch user info');
      }

      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTask = async () => {
    try {
      setLoading(true);
      const query = buildTimesheetQuery();

      const res = await fetch(`${prefix}/api/v1/timesheet?${query}`);
      const json = await res.json();
      const data = json.data as ITimeSheetResponse[];

      if (!res.ok) {
        throw new Error('Failed to fetch tasks data');
      }

      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    const prefix = process.env.NEXT_PUBLIC_APP_URL;

    const res = await fetch(`${prefix}/api/v1/timesheet/${taskId}`, {
      method: 'DELETE',
    });
    const json = await res.json();

    if (!res.ok) {
      throw new Error('Failed to delete task');
    } else {
      toast(json.message);
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
    const key = format(day, 'yyyy-MM-dd');
    const seconds = getDailyWorkSeconds().get(key) ?? 0;

    const today = startOfDay(new Date());
    const startWorkDate = userInfo?.user?.start_date
      ? startOfDay(new Date(userInfo.user.start_date))
      : null;

    if (isWeekend(day)) {
      return DAYTASKSTATUS.IGNORE;
    }

    if (startWorkDate && isBefore(startOfDay(day), startWorkDate)) {
      return DAYTASKSTATUS.IGNORE;
    }

    if (!isBefore(startOfDay(day), today)) {
      return DAYTASKSTATUS.IGNORE;
    }

    if (seconds === 0) {
      return DAYTASKSTATUS.NOTASK;
    }

    if (seconds < EIGHT_HOURS) {
      return DAYTASKSTATUS.INPROGRESS;
    }

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
        weekDays,
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
        fetchTaskOption,
        buildTimesheetQuery,
        getTask,
        deleteTask,
        getUserInfo,
        getDailyWorkSeconds,
        getDayStatus,
        setWeekAnchorDate,
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
