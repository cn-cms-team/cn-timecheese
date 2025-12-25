'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ListPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { createColumns } from '../position-list-columns';
import { PositionList } from '../postion-list';
import { IPosition } from '@/types/setting/position';

const PositionButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div>
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push('/setting/position/create')}
      >
        <ListPlus className="w-4 h-4" />
        เพิ่มตำแหน่ง
      </Button>
    </div>
  );
};

const PostionListView = () => {
  const router = useRouter();
  const fetchPositionsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/position`;
  const [positionList, setPositionList] = useState<IPosition[]>([]);
  const getPositions = async () => {
    const response = await fetch(fetchPositionsUrl);
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
    getPositions().then((data) => {
      setPositionList(data);
    });
  }, []);

  const deletePosition = async (id: string) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/position/${id}`;
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/position');
    });
  };

  const handleOpenDialog = async (mode: 'edit' | 'delete', isActive: boolean, id: string, {name}: {name : string}) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลผู้ใช้งาน '${name}' ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();

        if (result) {
          router.push(`/setting/position/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลผู้ใช้งาน '${name}' ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();

        if (!id) return;
        if (result) {
          await deletePosition(id).then(async () => {
            await getPositions().then((data) => {
              setPositionList(data);
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
        headerTitle={'ตำแหน่ง'}
        headerButton={<PositionButton />}
        content={<PositionList columns={columns} data={positionList} />}
      ></ModuleLayout>

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default PostionListView;
