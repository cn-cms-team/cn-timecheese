'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { createColumns } from '../team-list-columns';
import { useEffect, useState } from 'react';
import { ITeam } from '@/types/setting/team';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { TeamList } from '../team-list';
import { toast } from 'sonner';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Account, useAccount } from '@/components/context/app-context';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';

const TeamButton = ({ account }: { account: Account }): React.ReactNode => {
  const router = useRouter();
  if (!renderByPermission(account, EModules.ADMIN_TEAM, 'CREATE')) {
    return <></>;
  }
  return (
    <div>
      <Button onClick={() => router.push('/setting/team/create')}>
        <Plus className="w-4 h-4" />
        เพิ่มทีม
      </Button>
    </div>
  );
};

const TeamListView = () => {
  const { account } = useAccount();
  const router = useRouter();
  const fetchTeamUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/team`;
  const { data, error, isLoading, mutate } = useSWR(fetchTeamUrl, (url) => fetcher<ITeam[]>(url));

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

  const deleteTeam = async (id: string) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/team/${id}`;
    try {
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
    }
  };
  const handleOpenDialog = async (mode: 'edit' | 'delete', id: string, team: { name: string }) => {
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
          await deleteTeam(id).then(async () => {
            mutate();
          });
        }
      }
    } catch (error) {}
  };

  const columns = createColumns({
    account: account,
    onOpenDialog: handleOpenDialog,
  });
  if (error) {
    router.replace('/404');
    return null;
  }

  return (
    <>
      <ModuleLayout
        headerTitle={'ทีม'}
        headerButton={<TeamButton account={account} />}
        content={<TeamList columns={columns} data={data || []} loading={isLoading} />}
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
