'use client';

import LabelGroup from '@/components/ui/custom/form/label-group';
import { ITaskType, ITaskView } from '@/types/setting/task-type';
import { useEffect, useState } from 'react';
import TaskTypeCreateTable from './task-type-create-table';
import { taskTypeMenu } from '@/lib/constants/task';
import { TitleGroup } from '@/components/ui/custom/cev';
import { useLoading } from '@/components/context/app-context';

const TaskTypeViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const { setIsLoading } = useLoading();
  const [taskTypeData, setTaskTypeData] = useState<ITaskView>();
  useEffect(() => {
    const fetchTaskTypeData = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchTaskTypeData();
    }
  }, [id]);

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลหมวดหมู่งาน" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <LabelGroup label="ชื่อ" value={taskTypeData?.name} />
        <LabelGroup label="ประเภท" value={taskTypeData?.id} />
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
