'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import UserCreate from '../user-create';
import { useRouter } from 'next/navigation';

const UserCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex align-middle">
      <Button className="btn btn-outline-primary font-bold" type="submit" form="user-create-form">
        บันทึก
      </Button>
      <Button
        className="btn btn-outline-secondary font-bold ml-2"
        onClick={() => router.push('/setting/user')}
      >
        ยกเลิก
      </Button>
    </div>
  );
};

const UserCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}
      headerButton={<UserCreateButton />}
      content={<UserCreate id={id} />}
    ></ModuleLayout>
  );
};
export default UserCreateView;
