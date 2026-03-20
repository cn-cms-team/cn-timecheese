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
import ModalProjectReportMembers from './modal-project-report-members';
import { IProjectReportMember } from '@/types/setting/project';

const ProjectViewButton = ({
  onOpenDialog,
  onAddPMUser,
}: {
  onOpenDialog: (mode: 'edit' | 'delete') => void;
  onAddPMUser: () => void;
}): React.ReactNode => {
  const { account } = useAccount();
  const canEdit = renderByPermission(account, EModules.ADMIN_PROJECT, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_PROJECT, 'DELETE');
  if (!canEdit && !canDelete) {
    return <></>;
  }
  return (
    <div className="flex gap-3 items-middle">
      {canEdit && <Button onClick={() => onAddPMUser()}>เพิ่มสิทธิ์ดูรายงาน</Button>}
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
  const [projectReportMembers, setProjectReportMembers] = useState<IProjectReportMember[]>([]);
  const [isOpenReportMemberModal, setIsOpenReportMemberModal] = useState(false);
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
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลโครงการ : ${projectName} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (result && id) {
          setIsLoading(true);
          const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/project/${id}`;
          const res = await fetch(fetchUrl, { method: 'DELETE' });
          const result = await res.json();
          if (res.ok) {
            if (result.message) {
              toast.success(result.message);
            }
            router.push('/setting/project');
          } else {
            toast.error(result.message || 'An unexpected error occurred. Please try again.');
          }
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onAddPMUser = () => {
    setIsOpenReportMemberModal(true);
  };

  return (
    <>
      <ModuleLayout
        headerTitle={'รายละเอียดโครงการ'}
        leaveUrl={'/setting/project'}
        headerButton={
          <ProjectViewButton onOpenDialog={handleOpenDialog} onAddPMUser={onAddPMUser} />
        }
        content={
          <ProjectViewDetail
            id={id}
            onDataLoaded={(name, reportMembers) => {
              setProjectName(name);
              setProjectReportMembers(reportMembers ?? []);
            }}
          />
        }
      ></ModuleLayout>
      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
      <ModalProjectReportMembers
        open={isOpenReportMemberModal}
        onOpenChange={setIsOpenReportMemberModal}
        projectId={id}
        members={projectReportMembers}
        onMembersChanged={setProjectReportMembers}
      />
    </>
  );
};
export default ProjectView;
