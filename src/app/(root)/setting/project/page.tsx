import { ProjectListView } from '@/components/pages/setting/project/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ตั้งค่าโครงการ - Timecheese',
  description: 'Timecheese',
};

const ProjectSetting = () => {
  return <ProjectListView />;
};

export default ProjectSetting;
