'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';

const DashboardView = () => {
  return (
    <ModuleLayout
      headerTitle="Dashboard"
      headerButton={null}
      content={<div>dashboard content</div>}
    />
  );
};

export default DashboardView;
