'use client';

import { useEffect, useState } from 'react';
import { LabelGroup } from '@/components/ui/custom/form';
import TaskTypeCreateTable from './task-type-create-table';
import { taskTypeMenu } from '@/lib/constants/task';
import { ITaskType, ITaskView } from '@/types/setting/task-type';
import TaskTypeCreateDialog from './task-type-create-dialog';
import { TaskTypeCode } from '../../../../../generated/prisma/enums';
import { Button } from '@/components/ui/button';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { TitleGroup } from '@/components/ui/custom/cev';
import { toast } from 'sonner';

const TaskTypeCreate = ({ id }: { id: string }): React.ReactNode => {
  const [defaultTaskType, setDefaultTaskType] = useState<ITaskType>({
    name: '',
    description: '',
    type: id as TaskTypeCode,
    is_active: true,
  });
  const [taskItem, setTaskItem] = useState<ITaskView>();
  const [open, setOpen] = useState<boolean>(false);
  const [getConfirmation, Confirmation] = useDialogConfirm();
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmType?: ConfirmType;
  }>({
    title: '',
    message: '',
    confirmType: ConfirmType.SUBMIT,
  });
  const fetchTaskTypeData = async (task_type_id: string) => {
    try {
      const taskMenu = taskTypeMenu.find((e) => e.id === id);
      const response = await fetch(`/api/v1/setting/task-type/${task_type_id}`, {
        method: 'GET',
      });
      const result = await response.json();
      if (response.ok) {
        toast(result.message);
        const taskTypeData = result.data;

        if (taskMenu) {
          setTaskItem({
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
  useEffect(() => {
    if (id) {
      fetchTaskTypeData(id);
    }
  }, []);

  const deleteTaskType = async (task_id: string) => {
    try {
      const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/task-type/${task_id}`;
      await fetch(fetchUrl, { method: 'DELETE' }).then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          toast(result.message);
          await fetchTaskTypeData(id);
        }
      });
    } catch (error) {
      toast(error as string);
    }
  };
  const handleOpenDialog = async (mode: 'edit' | 'delete', task_id: string) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลประเภทงานนี้ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          const taskTypeItem = taskItem?.task_type.find((e) => e.id === task_id);
          if (taskTypeItem) {
            setDefaultTaskType(taskTypeItem as ITaskType);
            setOpen(true);
          }
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลประเภทงานนี้ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (!task_id) return;
        else if (result) {
          await deleteTaskType(task_id);
        }
      }
    } catch (error) {}
  };

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลหมวดหมู่งาน" />
      <div className="flex flex-col space-y-5 px-8 mb-5">
        <LabelGroup label="ชื่อ" className="w-full sm:w-1/2" value={taskItem?.name} />

        <LabelGroup label="คำอธิบาย" value={taskItem?.description || '-'} />
      </div>
      <h2 className="font-medium text-lg mb-0">ข้อมูลประเภทงาน</h2>
      <hr className="mt-2 mb-5" />

      <TaskTypeCreateTable
        data={taskItem?.task_type as ITaskType[]}
        onOpenDialog={handleOpenDialog}
        mode="edit"
      ></TaskTypeCreateTable>
      <div className="flex w-full py-4 px-2">
        <Button
          size="sm"
          className="flex justify-start items-center px-2 h-9"
          onClick={() => setOpen(true)}
        >
          เพิ่มข้อมูล
        </Button>
      </div>
      <TaskTypeCreateDialog
        open={open}
        onOpen={setOpen}
        type={id as TaskTypeCode}
        taskItem={defaultTaskType as ITaskType}
        getData={fetchTaskTypeData}
      />

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </div>
  );
};
export default TaskTypeCreate;
