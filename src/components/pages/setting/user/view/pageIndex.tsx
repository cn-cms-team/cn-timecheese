'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { UserList } from '../user-list';
import { createColumns } from '../user-list-columns';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/setting/user';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';

const UserButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div>
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push('/setting/user/create')}
      >
        <UserPlus className="w-4 h-4" />
        เพิ่มผู้ใช้งาน
      </Button>
    </div>
  );
};

const UserListView = () => {
  const router = useRouter();
  const fetchUsersUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user`;
  const [userList, setUserList] = useState<IUser[]>([]);
  const getUsers = async () => {
    const response = await fetch(fetchUsersUrl);
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
    getUsers().then((data) => {
      setUserList(data);
    });
  }, []);

  const deleteUser = async (id: string) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user/${id}`;
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/user');
    });
  };
  const handleOpenDialog = async (mode: 'edit' | 'delete', isActive: boolean, id: string) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลผู้ใช้งาน : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          router.push(`/setting/user/${id}/edit`);
        }
      } else {
        setConfirmState({
          title: 'ลบข้อมูล',
          message: `คุณยืนยันที่จะลบข้อมูลผู้ใช้งาน : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.DELETE,
        });

        const result = await getConfirmation();
        if (!id) return;
        if (result) {
          await deleteUser(id).then(async () => {
            await getUsers().then((data) => {
              setUserList(data);
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
        headerTitle={'ผู้ใช้งาน'}
        headerButton={<UserButton />}
        content={<UserList columns={columns} data={userList} />}
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
