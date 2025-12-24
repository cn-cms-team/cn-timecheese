'use client';

import LabelGroup from '@/components/ui/custom/form/label-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { ITaskType } from '@/types/setting/task-type';
import { useEffect, useState } from 'react';

const TaskTypeViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const [taskTypeData, setTaskTypeData] = useState<ITaskType>();
  useEffect(() => {
    const fetchTaskTypeData = async () => {
      try {
        const response = await fetch(`/api/v1/setting/task-type/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const taskTypeData = result.data;
          setTaskTypeData(taskTypeData);
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
    <div className="flex flex-col px-5">
      <h2 className="font-medium text-lg mb-0">ข้อมูลประเภทงาน</h2>
      <hr className="mt-2 mb-5" />
      <div className="flex flex-wrap space-y-5">
        <div className="flex w-full">
          <LabelGroup label="ชื่อ" className="w-full sm:w-1/2" value={taskTypeData?.name} />
          <LabelGroup label="ประเภท" className="w-full sm:w-1/2" value={taskTypeData?.type} />
        </div>
        <LabelGroup label="คำอธิบาย" value={taskTypeData?.description} />
        <LabelGroup label="สถานะการใช้งาน" value="">
          <div className="flex items-center space-x-2">
            <Switch
              checked={taskTypeData?.is_active as boolean}
              aria-readonly
              disabled
              className="disabled:opacity-80"
              id="is-task-type-active"
            />
            <Label htmlFor="is-task-type-active" className="peer-disabled:opacity-80 text-base">
              {getIsActive(taskTypeData?.is_active as boolean)}
            </Label>
          </div>
        </LabelGroup>
      </div>
    </div>
  );
};
export default TaskTypeViewDetail;
