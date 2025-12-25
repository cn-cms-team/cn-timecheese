import { TaskTypeCreateView } from '@/components/pages/setting/task-type/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit TaskType - Time Cheese',
  description: 'Time Cheese',
};

const TaskTypeEditSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TaskTypeCreateView id={id} />;
};

export default TaskTypeEditSetting;
