import { ProjectCreateView } from '@/components/pages/setting/project/view';
import { UserCreateView } from '@/components/pages/setting/user/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Project - Time Cheese',
  description: 'Time Cheese',
};

const ProjectEditSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ProjectCreateView id={id} />;
};

export default ProjectEditSetting;
