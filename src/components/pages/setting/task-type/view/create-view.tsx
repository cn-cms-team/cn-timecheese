'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import TaskTypeCreate from '../task-type-create';

const TaskTypeCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขประเภทงาน' : 'เพิ่มประเภทงาน'}
      leaveUrl={'/setting/task-type'}
      content={<TaskTypeCreate id={id!} />}
    ></ModuleLayout>
  );
};
export default TaskTypeCreateView;
