'use client';

import { createContext } from 'react';

interface IDashboardContextType {
  loading: boolean;
}

const DashboardContext = createContext<IDashboardContextType | undefined>(undefined);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const loading = false;

  return <DashboardContext.Provider value={{ loading }}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = createContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardProvider;
