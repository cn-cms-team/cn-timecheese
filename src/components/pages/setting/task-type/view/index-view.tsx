'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { TaskTypeList } from '../task-type-list';
import { createColumns } from '../task-type-list-columns';
import { useState } from 'react';
import { ITaskMenu } from '@/types/setting/task-type';
import { useRouter } from 'next/navigation';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { taskTypeMenu } from '@/lib/constants/task';
import { useAccount } from '@/components/context/app-context';

const TaskTypeListView = () => {
  const { account } = useAccount();
  const router = useRouter();
  const [taskMenuList, setTaskMenuList] = useState<ITaskMenu[]>(taskTypeMenu);

  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmType?: ConfirmType;
  }>({
    title: '',
    message: '',
    confirmType: ConfirmType.SUBMIT,
  });
  const [getConfirmation, Confirmation] = useDialogConfirm();

  const handleOpenDialog = async (
    mode: 'edit' | 'delete',
    id: string,
    { name }: { name: string }
  ) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลประเภทงาน : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/task-type/${id}/edit`);
        }
      }
    } catch (error) {}
  };

  const columns = createColumns({
    account: account,
    onOpenDialog: handleOpenDialog,
  });

  return (
    <>
      <ModuleLayout
        headerTitle={'ประเภทงาน'}
        content={<TaskTypeList columns={columns} data={taskMenuList} />}
      ></ModuleLayout>

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default TaskTypeListView;
