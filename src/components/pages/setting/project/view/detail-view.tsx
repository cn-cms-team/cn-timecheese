'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import ProjectViewDetail from '../project-view';
import { useRouter } from 'next/navigation';

const ProjectViewButton = ({ id }: { id: string }): React.ReactNode => {
  const router = useRouter();
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/project/${id}`;
  const deleteUser = async () => {
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/project');
    });
  };
  return (
    <div className="flex items-middle">
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push(`/setting/project/${id}/edit`)}
      >
        แก้ไข
      </Button>
      <Button className="btn btn-outline-secondary font-bold ml-2" onClick={() => deleteUser()}>
        ลบ
      </Button>
    </div>
  );
};

const ProjectView = ({ id }: { id: string }) => {
  return (
    <ModuleLayout
      headerTitle={'รายละเอียดโครงการ'}
      leaveUrl={'/setting/project'}
      headerButton={<ProjectViewButton id={id} />}
      content={<ProjectViewDetail id={id} />}
    ></ModuleLayout>
  );
};
export default ProjectView;
