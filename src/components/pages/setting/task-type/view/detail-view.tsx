'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import TaskTypeViewDetail from '../task-type-view';
import { useRouter } from 'next/navigation';

const TaskTypeViewButton = ({ id }: { id: string }): React.ReactNode => {
  const router = useRouter();
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/task-type/${id}`;
  const deleteTaskType = async () => {
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/task-type');
    });
  };
  return (
    <div className="flex items-middle">
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push(`/setting/task-type/${id}/edit`)}
      >
        แก้ไข
      </Button>
      <Button className="btn btn-outline-secondary font-bold ml-2" onClick={() => deleteTaskType()}>
        ลบ
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
