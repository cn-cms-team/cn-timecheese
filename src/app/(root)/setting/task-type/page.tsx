import { TaskTypeListView } from '@/components/pages/setting/task-type/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TaskType - Time Cheese',
  description: 'Time Cheese',
};

const TaskTypeSetting = () => {
  return <TaskTypeListView />;
};

export default TaskTypeSetting;
