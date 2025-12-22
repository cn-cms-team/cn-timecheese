'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { fetcher } from '@/lib/fetcher';
import { IUser } from '@/types/setting/user';
import useDialogConfirm from '@/hooks/use-dialog-confirm';

import { Button } from '@/components/ui/button';
import ResetPasswordForm from '../reset-password-form';
import { useSession } from 'next-auth/react';
import ModuleLayout from '@/components/layouts/ModuleLayout';

type ButtonProps = {
  handleCancel: () => void;
};

const UserButton = ({ handleCancel }: ButtonProps): React.ReactNode => {
  return (
    <div className="flex items-center gap-2">
      <Button variant={'outline'} onClick={handleCancel}>
        ยกเลิก
      </Button>
      <Button className="btn btn-outline-primary" type="submit" form="user-reset-password-form">
        บันทึก
      </Button>
    </div>
  );
};

const ResetPasswordView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [user, setUser] = useState<IUser>();
  const [confirmState, setConfirmState] = useState({ title: '', message: '' });
  const [getConfirmation, Confirmation] = useDialogConfirm();

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user/${session?.user.id}`;
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
        headerButton={<UserButton handleCancel={handleCancel} />}
        content={
          <ResetPasswordForm
            currentData={user}
            formRef={formRef as React.RefObject<HTMLFormElement>}
          />
        }
      ></ModuleLayout>

      <Confirmation title={confirmState.title} message={confirmState.message} />
    </>
  );
};

export default ResetPasswordView;
