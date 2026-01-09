'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import ReportProjectContent from '../report-project-content';

const ReportProjectView = () => {
  return (
    <ModuleLayout headerTitle={'รายงานโครงการ'} content={<ReportProjectContent />}></ModuleLayout>
  );
};
export default ReportProjectView;
