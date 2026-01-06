'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import DashboardProvider from './dashboard-usecontext';

const DashboardView = () => {
  return (
    <ModuleLayout
      headerTitle="Dashboard"
      headerButton={null}
      content={
        <DashboardProvider>
          <div>Dashboard Content Goes Here</div>
        </DashboardProvider>
      }
    />
  );
};

export default DashboardView;
