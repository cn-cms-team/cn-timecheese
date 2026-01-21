'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import PositionViewDetail from '../position-view';
import { useRouter } from 'next/navigation';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { useState } from 'react';
import { toast } from 'sonner';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';
import { useAccount, useLoading } from '@/components/context/app-context';

const PositionViewButton = ({
  id,
  onOpenDialog,
}: {
  id: string;
  onOpenDialog: (mode: 'edit' | 'delete') => void;
}): React.ReactNode => {
  const { account } = useAccount();
  const canEdit = renderByPermission(account, EModules.ADMIN_POSITION, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_POSITION, 'DELETE');
  if (!canEdit && !canDelete) {
    return <></>;
  }
  return (
    <div className="flex gap-3 align-middle">
      <Button onClick={() => onOpenDialog('edit')}>แก้ไข</Button>
      <Button variant={'destructive'} onClick={() => onOpenDialog('delete')}>
        ลบ
      </Button>
    </div>
  );
};

const PositionView = ({ id }: { id: string }) => {
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const [positionName, setPositionName] = useState<string>('');
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
          message: `คุณยืนยันที่จะแก้ไขข้อมูลตำแหน่ง : ${positionName} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/position/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลตำแหน่ง : ${positionName} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (result && id) {
          setIsLoading(true);
          const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/position/${id}`;
          const res = await fetch(fetchUrl, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) {
            toast(data.message);
            return;
          } else {
            router.push('/setting/position');
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
        headerTitle={'รายละเอียดตำแหน่ง'}
        leaveUrl={`/setting/position`}
        headerButton={<PositionViewButton id={id} onOpenDialog={handleOpenDialog} />}
        content={<PositionViewDetail id={id} onDataLoaded={(name) => setPositionName(name)} />}
      />

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};

export default PositionView;
