'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { createColumns } from '../team-list-columns';
import { useEffect, useState } from 'react';
import { ITeam } from '@/types/setting/team';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { TeamList } from '../team-list';

const TeamButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div>
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push('/setting/team/create')}
      >
        <UserPlus className="w-4 h-4" />
        เพิ่มทีม
      </Button>
    </div>
  );
};

const TeamListView = () => {
  const router = useRouter();
  const fetchTeamUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/team`;
  const [teamList, setteamList] = useState<ITeam[]>([]);
  const getTeams = async () => {
    const response = await fetch(fetchTeamUrl);
    const result = await response.json();
    return result.data;
  };

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

  useEffect(() => {
    getTeams().then((data) => {
      setteamList(data);
    });
  }, []);

  const deleteUser = async (id: string) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/team/${id}`;
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/team');
    });
  };
  const handleOpenDialog = async (
    mode: 'edit' | 'delete',
    isActive: boolean,
    id: string,
    team: { name: string }
  ) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลทีม : ${team.name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/team/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลทีม : ${team.name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (!id) return;
        if (result) {
          await deleteUser(id).then(async () => {
            await getTeams().then((data) => {
              setteamList(data);
            });
          });
        }
      }
    } catch (error) {}
  };

  const columns = createColumns({
    onOpenDialog: handleOpenDialog,
  });

  return (
    <>
      <ModuleLayout
        headerTitle={'ทีม'}
        headerButton={<TeamButton />}
        content={<TeamList columns={columns} data={teamList} />}
      ></ModuleLayout>

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default TeamListView;
