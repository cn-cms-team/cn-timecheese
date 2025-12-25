import { TaskTypeCreateView } from '@/components/pages/setting/task-type/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create TaskType - Time Cheese',
  description: 'Time Cheese',
};

const TaskTypeCreateSetting = async () => {
  return <TaskTypeCreateView />;
};

export default TaskTypeCreateSetting;
