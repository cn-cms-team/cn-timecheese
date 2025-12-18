'use client';
import { PERIODCALENDAR } from '@/lib/constants/period-calendar';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ITimeSheetContextType {
  loading: boolean;
  period: PERIODCALENDAR;
  setLoading: (isLoading: boolean) => void;
  setPeriod: (value: PERIODCALENDAR) => void;
}

interface ITimeSheetProviderProps {
  children: ReactNode;
}

const TimeSheetContext = createContext<ITimeSheetContextType | undefined>(undefined);

const TimeSheetProvider = ({ children }: ITimeSheetProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(PERIODCALENDAR.DATE);

  return (
    <TimeSheetContext.Provider value={{ loading, setLoading, period, setPeriod }}>
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
