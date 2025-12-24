'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import TaskTypeCreate from '../task-type-create';
import { useRouter } from 'next/navigation';

const TaskTypeCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex items-middle gap-2">
      <Button
        className="btn btn-outline font-bold"
        variant={'outline'}
        onClick={() => router.push('/setting/task-type')}
      >
        ยกเลิก
      </Button>
      <Button
        className="btn btn-outline-primary font-bold"
        type="submit"
        form="task-type-create-form"
      >
        บันทึก
      </Button>
    </div>
  );
};

const TaskTypeCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขประเภทงาน' : 'เพิ่มประเภทงาน'}
      leaveUrl={'/setting/task-type'}
      headerButton={<TaskTypeCreateButton />}
      content={<TaskTypeCreate id={id} />}
    ></ModuleLayout>
  );
};
export default TaskTypeCreateView;
