import { ProjectCreateView } from '@/components/pages/setting/project/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Project - CN Timesheet',
  description: 'CN Timesheet',
};

const ProjectCreateSetting = async () => {
  return <ProjectCreateView />;
};

export default ProjectCreateSetting;
