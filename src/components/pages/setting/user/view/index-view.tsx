'use client';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { fetcher } from '@/lib/fetcher';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { UserList } from '../user-list';
import { createColumns } from '../user-list-columns';
import { useState } from 'react';
import { IUser } from '@/types/setting/user';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { Account, useAccount } from '@/components/context/app-context';
import { EModules } from '@/lib/constants/module';

const UserButton = ({ account }: { account: Account }): React.ReactNode => {
  const router = useRouter();
  if (!renderByPermission(account, EModules.ADMIN_USER, 'CREATE')) {
    return <></>;
  }
  return (
    <div>
      <Button onClick={() => router.push('/setting/user/create')}>
        <Plus className="w-4 h-4" />
        เพิ่มผู้ใช้งาน
      </Button>
    </div>
  );
};

const UserListView = () => {
  const { account } = useAccount();
  const router = useRouter();
  const fetchUsersUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user`;
  const { data, error, isLoading, mutate } = useSWR(fetchUsersUrl, (url) => fetcher<IUser[]>(url));

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

  const deleteUser = async (id: string) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user/${id}`;
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/user');
    });
  };
  const handleOpenDialog = async (
    mode: 'edit' | 'delete',
    id: string,
    { email }: { email: string }
  ) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลผู้ใช้งาน : ${email} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/user/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลผู้ใช้งาน : ${email} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (!id) return;
        if (result) {
          await deleteUser(id).then(async () => {
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
        headerTitle={'ผู้ใช้งาน'}
        headerButton={<UserButton account={account} />}
        content={<UserList columns={columns} data={data || []} loading={isLoading} />}
      ></ModuleLayout>

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default UserListView;
