'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import TeamViewDetail from '../team-view';
import { toast } from 'sonner';
import { useAccount, useLoading } from '@/components/context/app-context';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';

const TeamViewButton = ({ id }: { id: string }): React.ReactNode => {
  const { account } = useAccount();
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/team/${id}`;
  const deleteTeam = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(fetchUrl, {
        method: 'DELETE',
      });
      if (response.ok) {
        const result = await response.json();
        toast(result.message);
        router.push('/setting/team');
      }
    } catch {
      toast('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const canEdit = renderByPermission(account, EModules.ADMIN_TEAM, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_TEAM, 'DELETE');
  if (!canEdit && !canDelete) {
    return <></>;
  }
  return (
    <div className="flex align-middle gap-2">
      {canEdit && <Button onClick={() => router.push(`/setting/team/${id}/edit`)}>แก้ไข</Button>}
      {canDelete && (
        <Button variant={'destructive'} onClick={() => deleteTeam()}>
          ลบ
        </Button>
      )}
    </div>
  );
};

const TeamView = ({ id }: { id: string }) => {
  return (
    <ModuleLayout
      headerTitle={'รายละเอียดทีม'}
      leaveUrl={'/setting/team'}
      headerButton={<TeamViewButton id={id} />}
      content={<TeamViewDetail id={id} />}
    ></ModuleLayout>
  );
};
export default TeamView;
