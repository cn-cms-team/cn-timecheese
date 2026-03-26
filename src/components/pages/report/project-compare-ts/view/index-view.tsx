'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import ReportProjectCompareTsDetail from '../report-project-compare-ts-detail';

const ReportProjectCompareTsView = () => {
  return (
    <ModuleLayout
      headerTitle={'รายงานสรุป TS ระหว่างโครงการ'}
      content={<ReportProjectCompareTsDetail />}
    ></ModuleLayout>
  );
};

export default ReportProjectCompareTsView;
