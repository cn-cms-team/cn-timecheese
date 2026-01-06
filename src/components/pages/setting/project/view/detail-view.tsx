'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import ProjectViewDetail from '../project-view';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';
import { useAccount } from '@/components/context/app-context';

const ProjectViewButton = ({ id }: { id: string }): React.ReactNode => {
  const { account } = useAccount();
  const router = useRouter();
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/project/${id}`;
  const deleteProject = async () => {
    const response = await fetch(fetchUrl, { method: 'DELETE' });
    const result = await response.json();
    if (!result.ok) {
      toast(result.message);
    } else {
      router.push('/setting/project');
    }
  };
  const canEdit = renderByPermission(account, EModules.ADMIN_PROJECT, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_PROJECT, 'DELETE');
  if (!canEdit && !canDelete) {
    return <></>;
  }
  return (
    <div className="flex gap-3 items-middle">
      {canEdit && <Button onClick={() => router.push(`/setting/project/${id}/edit`)}>แก้ไข</Button>}
      {canDelete && (
        <Button variant={'destructive'} onClick={() => deleteProject()}>
          ลบ
        </Button>
      )}
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
