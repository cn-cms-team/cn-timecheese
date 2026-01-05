import ProjectView from '@/components/pages/setting/project/view/detail-view';
import { UserView } from '@/components/pages/setting/user/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Project - Time Cheese',
  description: 'Time Cheese',
};

const ProjectViewSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ProjectView id={id} />;
};

export default ProjectViewSetting;
