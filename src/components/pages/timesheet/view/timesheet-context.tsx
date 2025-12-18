'use client';
import { createContext, ReactNode, useState } from 'react';

interface ITimeSheetContextType {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
}

interface ITimeSheetProviderProps {
  children: ReactNode;
}

const TimeSheetContext = createContext<ITimeSheetContextType | undefined>(undefined);

const TimeSheetProvider = ({ children }: ITimeSheetProviderProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <TimeSheetContext.Provider value={{ loading, setLoading }}>
      {children}
    </TimeSheetContext.Provider>
  );
};

export default TimeSheetProvider;
