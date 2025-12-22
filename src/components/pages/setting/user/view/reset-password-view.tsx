'use client';
import { useState, useEffect, Fragment, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { fetcher } from '@/lib/fetcher';
import { IUser } from '@/types/setting/user';
import useDialogConfirm from '@/hooks/use-dialog-confirm';

import { Button } from '@/components/ui/button';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { useLoading } from '@/components/context/app-context';
import ResetPasswordForm from '../reset-password-form';

type ButtonProps = {
  handleCancel: () => void;
};

const ResetPasswordButton = ({ handleCancel }: ButtonProps): React.ReactNode => {
  const { isLoading } = useLoading();
  return (
    <div className="flex items-center gap-2">
      <Button variant={'outline'} disabled={isLoading} onClick={handleCancel}>
        ยกเลิก
      </Button>
      <Button
        className="btn btn-outline-primary"
        type="submit"
        disabled={isLoading}
        form="user-reset-password-form"
      >
        บันทึก
      </Button>
    </div>
  );
};
const ResetPasswordView = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser>();
  const [confirmState, setConfirmState] = useState({ title: '', message: '' });
  const [getConfirmation, Confirmation] = useDialogConfirm();

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user/${id}`;
        const userData = await fetcher<IUser>(fetchUrl);
        if (userData) setUser(userData);
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetail();
  }, []);

  const handleCancel = async () => {
    setConfirmState({
      title: 'แจ้งเตือน',
      message: 'คุณต้องการออกจากหน้านี้ โดยไม่บันทึกข้อมูล ใช่หรือไม่ ?',
    });

    const result = await getConfirmation();
    if (result) router.push(`/`);
  };

  return (
    <>
      <ModuleLayout
        headerTitle={'รีเซ็ตรหัสผ่าน'}
        headerButton={<ResetPasswordButton handleCancel={handleCancel} />}
        content={<ResetPasswordForm userData={user} />}
      ></ModuleLayout>
      <Confirmation title={confirmState.title} message={confirmState.message} />
    </>
  );
};

export default ResetPasswordView;
