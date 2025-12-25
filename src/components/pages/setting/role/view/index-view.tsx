'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RoleList } from '../role-list';
import { IRole } from '@/types/setting/role';

import { useEffect, useState } from 'react';
import { createColumns } from '../role-list-column';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';

const RoleButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div>
      <Button onClick={() => router.push('/setting/role/create')}>เพิ่มสิทธิ์การใช้งาน</Button>
    </div>
  );
};

const RoleListView = () => {
  const router = useRouter();
  const fetchRolesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role`;
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const getRoles = async () => {
    const response = await fetch(fetchRolesUrl);
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

  const deleteRole = async (id: string) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role/${id}`;
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/role');
    });
  };

  const handleOpenDialog = async (mode: 'edit' | 'delete', id: string) => {
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
            await getRoles().then((data) => {
              setRoleList(data);
            });
          });
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    getRoles().then((data) => {
      setRoleList(data);
    });
  }, []);

  const columns = createColumns({
    onOpenDialog: handleOpenDialog,
  });

  return (
    <>
      <ModuleLayout
        headerTitle="สิทธิ์การใช้งาน"
        headerButton={<RoleButton />}
        content={<RoleList columns={columns} data={roleList} />}
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
