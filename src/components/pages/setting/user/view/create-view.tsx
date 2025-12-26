'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import UserCreate from '../user-create';
import { useRouter } from 'next/navigation';

const UserCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex items-middle gap-2">
      <Button variant={'outline'} onClick={() => router.push('/setting/user')}>
        ยกเลิก
      </Button>
      <Button type="submit" form="user-create-form">
        บันทึก
      </Button>
    </div>
  );
};

const UserCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}
      leaveUrl={'/setting/user'}
      headerButton={<UserCreateButton />}
      content={<UserCreate id={id} />}
    ></ModuleLayout>
  );
};
export default UserCreateView;
