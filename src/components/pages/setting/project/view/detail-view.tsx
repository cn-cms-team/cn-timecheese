'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import ProjectViewDetail from '../project-view';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';
import { useAccount, useLoading } from '@/components/context/app-context';
import { useState } from 'react';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';

const ProjectViewButton = ({
  id,
  onOpenDialog,
}: {
  id: string;
  onOpenDialog: (mode: 'edit' | 'delete') => void;
}): React.ReactNode => {
  const { account } = useAccount();
  const canEdit = renderByPermission(account, EModules.ADMIN_PROJECT, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_PROJECT, 'DELETE');
  if (!canEdit && !canDelete) {
    return <></>;
  }
  return (
    <div className="flex gap-3 items-middle">
      {canEdit && <Button onClick={() => onOpenDialog('edit')}>แก้ไข</Button>}
      {canDelete && (
        <Button variant={'destructive'} onClick={() => onOpenDialog('delete')}>
          ลบ
        </Button>
      )}
    </div>
  );
};

const ProjectView = ({ id }: { id: string }) => {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const [projectName, setProjectName] = useState<string>('');
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

  const handleOpenDialog = async (mode: 'edit' | 'delete') => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลโครงการ : ${projectName} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/project/${id}/edit`);
        }
      } else {
        setIsLoading(true);
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลโครงการ : ${projectName} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (result && id) {
          const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/project/${id}`;
          const res = await fetch(fetchUrl, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) {
            toast(data.message);
            return;
          } else {
            router.push('/setting/project');
            toast('Delete success');
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ModuleLayout
        headerTitle={'รายละเอียดโครงการ'}
        leaveUrl={'/setting/project'}
        headerButton={<ProjectViewButton id={id} onOpenDialog={handleOpenDialog} />}
        content={<ProjectViewDetail id={id} onDataLoaded={(name) => setProjectName(name)} />}
      ></ModuleLayout>
      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default ProjectView;
