import { TaskTypeView } from '@/components/pages/setting/task-type/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View TaskType - Time Cheese',
  description: 'Time Cheese',
};

const TaskTypeViewSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TaskTypeView id={id} />;
};

export default TaskTypeViewSetting;
