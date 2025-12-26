'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ProjectCreate from '../project-create';

const ProjectCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex align-middle gap-2">
      <Button variant={'outline'} onClick={() => router.push('/setting/project')}>
        ยกเลิก
      </Button>
      <Button type="submit" form="project-create-form">
        บันทึก
      </Button>
    </div>
  );
};

const ProjectCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขโครงการ' : 'เพิ่มโครงการ'}
      leaveUrl={'/setting/project'}
      headerButton={<ProjectCreateButton />}
      content={<ProjectCreate id={id} />}
    ></ModuleLayout>
  );
};
export default ProjectCreateView;
