'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RoleList } from '../role-list';
import { IRole } from '@/types/setting/role';

import { useEffect, useState } from 'react';
import { createColumns } from '../role-list-column';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { Plus } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Account, useAccount, useLoading } from '@/components/context/app-context';
import { EModules } from '@/lib/constants/module';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { toast } from 'sonner';

const RoleButton = ({ account }: { account: Account }): React.ReactNode => {
  const router = useRouter();
  if (!renderByPermission(account, EModules.ADMIN_ROLE, 'CREATE')) {
    return <></>;
  }
  return (
    <div>
      <Button onClick={() => router.push('/setting/role/create')}>
        <Plus className="w-4 h-4"></Plus>
        เพิ่มสิทธิ์การใช้งาน
      </Button>
    </div>
  );
};

const RoleListView = () => {
  const { account } = useAccount();
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const fetchRolesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role`;
  const { data, error, isLoading, mutate } = useSWR(fetchRolesUrl, (url) => fetcher<IRole[]>(url));

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

  const deleteRole = async (id: string) => {
    try {
      setIsLoading(true);
      const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role/${id}`;
      await fetch(fetchUrl, { method: 'DELETE' }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          toast(data.message);
          return;
        } else {
          toast(data.message);
          router.push('/setting/role');
        }
      });
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'Unknown error');
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
          message: `คุณยืนยันที่จะแก้ไขข้อมูลสิทธิ์การใช้งาน : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/role/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลสิทธิ์การใช้งาน : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (!id) return;
        if (result) {
          await deleteRole(id).then(async () => {
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
        headerTitle="สิทธิ์การใช้งาน"
        headerButton={<RoleButton account={account} />}
        content={<RoleList columns={columns} data={data || []} loading={isLoading} />}
      ></ModuleLayout>

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default RoleListView;
