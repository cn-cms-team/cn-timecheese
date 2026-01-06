'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Presentation, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { createColumns } from '../project-list-column';
import { ProjectList } from '../project-list';
import { IProject } from '@/types/setting/project';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Account, useAccount } from '@/components/context/app-context';
import { EModules } from '@/lib/constants/module';
import { renderByPermission } from '@/lib/functions/ui-manage';

const AddProjectButton = ({ account }: { account: Account }): React.ReactNode => {
  const router = useRouter();
  if (!renderByPermission(account, EModules.ADMIN_PROJECT, 'CREATE')) {
    return <></>;
  }
  return (
    <div>
      <Button onClick={() => router.push('/setting/project/create')}>
        <Presentation className="w-4 h-4" />
        เพิ่มโครงการ
      </Button>
    </div>
  );
};

const ProjectListView = () => {
  const { account } = useAccount();
  const router = useRouter();
  const fetchUsersUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/project`;
  const { data, error, isLoading, mutate } = useSWR(fetchUsersUrl, (url) =>
    fetcher<IProject[]>(url)
  );

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

  const deleteProject = async (id: string) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/project/${id}`;
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/project');
    });
  };

  const handleOpenDialog = async (mode: 'edit' | 'delete', id: string, code: string) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลโครงการ : ${code} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/project/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลโครงการ: ${code} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (!id) return;
        if (result) {
          await deleteProject(id).then(async () => {
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

  return (
    <>
      <ModuleLayout
        headerTitle={'โครงการ'}
        headerButton={<AddProjectButton account={account} />}
        content={<ProjectList columns={columns} data={data ?? []} />}
      ></ModuleLayout>

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default ProjectListView;
