'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import DashboardProvider from './dashboard-use-context';
import DashboardContent from '../dashboard-content';

const DashboardView = () => {
  return (
    <ModuleLayout
      headerTitle="Dashboard"
      headerButton={null}
      content={
        <DashboardProvider>
          <DashboardContent />
        </DashboardProvider>
      }
    />
  );
};

export default DashboardView;
