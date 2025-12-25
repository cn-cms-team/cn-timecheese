'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import TaskTypeViewDetail from '../task-type-view';
import { useRouter } from 'next/navigation';

const TaskTypeViewButton = ({ id }: { id: string }): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex items-middle">
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push(`/setting/task-type/${id}/edit`)}
      >
        แก้ไข
      </Button>
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
