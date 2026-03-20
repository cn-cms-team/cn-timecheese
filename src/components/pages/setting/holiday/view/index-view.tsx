'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Account, useAccount, useLoading } from '@/components/context/app-context';
import { Button } from '@/components/ui/button';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { EModules } from '@/lib/constants/module';
import { fetcher } from '@/lib/fetcher';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { IHoliday } from '@/types/setting/holiday';
import { deleteHoliday } from '../action';
import HolidayCreateDialog from '../holiday-create-dialog';
import { HolidayList } from '../holiday-list';
import { createColumns } from '../holiday-list-columns';

const HolidayButton = ({ account, onClick }: { account: Account; onClick: () => void }) => {
  const canCreate =
    renderByPermission(account, EModules.ADMIN, 'CREATE') ||
    renderByPermission(account, EModules.ADMIN_PROJECT, 'CREATE') ||
    !account.permissions;

  if (!canCreate) {
    return <></>;
  }

  return (
    <div>
      <Button onClick={onClick}>
        <Plus className="w-4 h-4" />
        เพิ่มวันหยุด
      </Button>
    </div>
  );
};

const HolidayListView = () => {
  const { account } = useAccount();
  const { setIsLoading } = useLoading();

  const fetchHolidaysUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/holidays`;
  const { data, error, isLoading, mutate } = useSWR(fetchHolidaysUrl, (url) =>
    fetcher<IHoliday[]>(url)
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<IHoliday | null>(null);

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

  const canEdit =
    renderByPermission(account, EModules.ADMIN, 'EDIT') ||
    renderByPermission(account, EModules.ADMIN_PROJECT, 'EDIT') ||
    !account.permissions;

  const canDelete =
    renderByPermission(account, EModules.ADMIN, 'DELETE') ||
    renderByPermission(account, EModules.ADMIN_PROJECT, 'DELETE') ||
    !account.permissions;

  const handleOpenDialog = async (
    mode: 'edit' | 'delete',
    id: string,
    { name, date, description }: { name: string; date: Date; description?: string | null }
  ) => {
    try {
      if (mode === 'edit') {
        setEditingHoliday({ id, name, date: new Date(date), description });
        setOpenDialog(true);
        return;
      }

      setConfirmState({
        title: 'ลบข้อมูล',
        message: `คุณยืนยันที่จะลบข้อมูลวันหยุด : ${name} ใช่หรือไม่ ?`,
        confirmType: ConfirmType.DELETE,
      });

      const result = await getConfirmation();
      if (!result) {
        return;
      }

      setIsLoading(true);
      const actionResult = await deleteHoliday(id);
      if (!actionResult.success) {
        toast.warning(actionResult.message || 'ไม่สามารถลบข้อมูลได้');
        return;
      }

      toast.success(actionResult.message || 'ลบข้อมูลสำเร็จ');
      await mutate();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = createColumns({
    canEdit,
    canDelete,
    onOpenDialog: handleOpenDialog,
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (error) {
    // router.replace('/404');
    return null;
  }

  return (
    <>
      <ModuleLayout
        headerTitle="วันหยุด"
        headerButton={
          <HolidayButton
            account={account}
            onClick={() => {
              setEditingHoliday(null);
              setOpenDialog(true);
            }}
          />
        }
        content={<HolidayList columns={columns} data={data || []} loading={isLoading} />}
      />

      <HolidayCreateDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        holidayItem={editingHoliday}
        onSubmitted={async () => {
          await mutate();
        }}
      />

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};

export default HolidayListView;
