'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import TaskTypeViewDetail from '../task-type-view';
import { useRouter } from 'next/navigation';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';
import { useAccount } from '@/components/context/app-context';

const TaskTypeViewButton = ({ id }: { id: string }): React.ReactNode => {
  const { account } = useAccount();
  const router = useRouter();
  if (!renderByPermission(account, EModules.ADMIN_TASK_TYPE, 'EDIT')) {
    return <></>;
  }
  return (
    <div className="flex items-middle gap-2">
      <Button onClick={() => router.push(`/setting/task-type/${id}/edit`)}>แก้ไข</Button>
    </div>
  );
};

const TaskTypeView = ({ id }: { id: string }) => {
  return (
    <ModuleLayout
      headerTitle={'รายละเอียดประเภทงาน'}
      leaveUrl={'/setting/task-type'}
      headerButton={<TaskTypeViewButton id={id} />}
      content={<TaskTypeViewDetail id={id} />}
    ></ModuleLayout>
  );
};
export default TaskTypeView;
