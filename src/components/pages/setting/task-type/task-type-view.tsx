'use client';

import LabelGroup from '@/components/ui/custom/form/label-group';
import { ITaskType, ITaskView } from '@/types/setting/task-type';
import { useEffect, useState } from 'react';
import TaskTypeCreateTable from './task-type-create-table';
import { taskTypeMenu } from '@/lib/constants/task';
import { TitleGroup } from '@/components/ui/custom/cev';

const TaskTypeViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const [taskTypeData, setTaskTypeData] = useState<ITaskView>();
  useEffect(() => {
    const fetchTaskTypeData = async () => {
      try {
        const taskMenu = taskTypeMenu.find((e) => e.id === id);

        const response = await fetch(`/api/v1/setting/task-type/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const taskTypeData = result.data;
          if (taskMenu) {
            setTaskTypeData({
              id: taskMenu.id,
              name: taskMenu.name,
              description: taskMenu.description,
              is_project_task: taskMenu.is_project_task,
              task_type: taskTypeData,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch task-type data:', error);
      }
    };
    if (id) {
      fetchTaskTypeData();
    }
  }, [id]);

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลหมวดหมู่งาน" />
      <div className="flex flex-wrap space-y-5">
        <div className="flex w-full">
          <LabelGroup label="ชื่อ" className="w-full sm:w-1/2" value={taskTypeData?.name} />
          <LabelGroup label="ประเภท" className="w-full sm:w-1/2" value={taskTypeData?.id} />
        </div>
        <LabelGroup label="คำอธิบาย" value={taskTypeData?.description} />
      </div>
      <TitleGroup title="ข้อมูลประเภทงาน" className="mt-5" />
      <TaskTypeCreateTable
        data={taskTypeData?.task_type as ITaskType[]}
        mode="view"
      ></TaskTypeCreateTable>
    </div>
  );
};
export default TaskTypeViewDetail;
