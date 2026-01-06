'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import PositionViewDetail from '../position-view';
import { useRouter } from 'next/navigation';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { useState } from 'react';
import { toast } from 'sonner';

const PositionViewButton = ({
  id,
  onOpenDialog,
}: {
  id: string;
  onOpenDialog: (mode: 'edit' | 'delete') => void;
}): React.ReactNode => {
  return (
    <div className="flex align-middle">
      <Button className="btn btn-outline-primary font-bold" onClick={() => onOpenDialog('edit')}>
        แก้ไข
      </Button>
      <Button
        className="btn btn-outline-secondary font-bold ml-2"
        onClick={() => onOpenDialog('delete')}
      >
        ลบ
      </Button>
    </div>
  );
};

const PositionView = ({ id }: { id: string }) => {
  const router = useRouter();
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
          const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/position/${id}`;
          const res = await fetch(fetchUrl, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) {
            toast.error(data.message);
            return;
          } else {
            router.push('/setting/position');
            toast.success('Delete Success!');
          }
        }
      }
    } catch (error) {
      console.error(error);
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
