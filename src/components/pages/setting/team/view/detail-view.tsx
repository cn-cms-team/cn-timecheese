'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import TeamViewDetail from '../team-view';

const TeamViewButton = ({ id }: { id: string }): React.ReactNode => {
  const router = useRouter();
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/team/${id}`;
  const deleteTeam = async () => {
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/team');
    });
  };
  return (
    <div className="flex align-middle">
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push(`/setting/team/${id}/edit`)}
      >
        แก้ไข
      </Button>
      <Button className="btn btn-outline-secondary font-bold ml-2" onClick={() => deleteTeam()}>
        ลบ
      </Button>
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
