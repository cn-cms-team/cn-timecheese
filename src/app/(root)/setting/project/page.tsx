import { ProjectListView } from '@/components/pages/setting/project/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project - Time Cheese',
  description: 'Time Cheese',
};

const ProjectSetting = () => {
  return <ProjectListView />;
};

export default ProjectSetting;
