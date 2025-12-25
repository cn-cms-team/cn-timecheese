'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RoleList } from '../role-list';
import { IRole } from '@/types/setting/role';

import { useEffect, useState } from 'react';
import { createColumns } from '../role-list-column';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { useLoading } from '@/components/context/app-context';
import { toast } from 'sonner';

const RoleButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div>
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push('/setting/role/create')}
      >
        เพิ่มสิทธิ์การใช้งาน
      </Button>
    </div>
  );
};

const RoleListView = () => {
  const router = useRouter();
  const fetchRolesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role`;
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const { isLoading, setIsLoading } = useLoading();
  const getRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(fetchRolesUrl);
      const result = await response.json();
      return result.data;
    } catch (error) {
      toast('ไม่สามารโหลดข้อมูลได้');
      return [];
    } finally {
      setIsLoading(false);
    }
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
    try {
      setIsLoading(true);
      await fetch(fetchUrl, { method: 'DELETE' });
      toast('ลบสิทธ์การใช้งานสำเร็จ');
    } catch (error) {
      toast('ลบสิทธ์การใช้งานไม่สำเร็จ');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = async (mode: 'edit' | 'delete', id: string) => {
    try {
      if (mode === 'edit') {
        setConfirmState({
          title: 'แก้ไขข้อมูล',
          message: `คุณยืนยันที่จะแก้ไขข้อมูลสิทธ์การใช้งาน : ${name} ใช่หรือไม่ ?`,
          confirmType: ConfirmType.SUBMIT,
        });

        const result = await getConfirmation();
        if (result) {
          toast(result);
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
