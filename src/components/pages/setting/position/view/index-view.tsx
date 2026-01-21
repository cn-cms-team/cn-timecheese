'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { createColumns } from '../position-list-columns';
import { PositionList } from '../postion-list';
import { IPosition } from '@/types/setting/position';
import { toast } from 'sonner';
import { Account, useAccount, useLoading } from '@/components/context/app-context';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr';

const PositionButton = ({ account }: { account: Account }): React.ReactNode => {
  const router = useRouter();
  if (!renderByPermission(account, EModules.ADMIN_POSITION, 'CREATE')) {
    return <></>;
  }
  return (
    <div>
      <Button onClick={() => router.push('/setting/position/create')}>
        <Plus className="w-4 h-4" />
        เพิ่มตำแหน่ง
      </Button>
    </div>
  );
};

const PositionListView = () => {
  const { account } = useAccount();
  const { setIsLoading } = useLoading();
  const router = useRouter();

  const fetchPositionsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/position`;
  const { data, error, isLoading, mutate } = useSWR(fetchPositionsUrl, (url) =>
    fetcher<IPosition[]>(url)
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

  const deletePosition = async (id: string) => {
    try {
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
    } catch (error) {
      console.error('Failed to delete position:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = async (
    mode: 'edit' | 'delete',
    id: string,
    { name }: { name: string }
  ) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลตำแหน่ง : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();

        if (result) {
          router.push(`/setting/position/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลตำแหน่ง : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();

        if (!id) return;
        if (result) {
          await deletePosition(id).then(async () => {
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

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);
  if (error) {
    router.replace('/404');
    return null;
  }
  return (
    <>
      <ModuleLayout
        headerTitle={'ตำแหน่ง'}
        headerButton={<PositionButton account={account} />}
        content={<PositionList columns={columns} data={data || []} loading={isLoading} />}
      ></ModuleLayout>

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default PositionListView;
