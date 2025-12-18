'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import UserCreate from '../user-create';

const UserCreateButton = (): React.ReactNode => {
  return (
    <div className="flex align-middle">
      <Button className="btn btn-outline-primary font-bold" onClick={() => console.log('Add User')}>
        บันทึก
      </Button>
      <Button
        className="btn btn-outline-secondary font-bold ml-2"
        onClick={() => console.log('Cancel')}
      >
        ยกเลิก
      </Button>
    </div>
  );
};

const UserCreateView = () => {
  return (
    <ModuleLayout
      headerTitle={'เพิ่มผู้ใช้งาน'}
      headerButton={<UserCreateButton />}
      content={<UserCreate />}
    ></ModuleLayout>
  );
};
export default UserCreateView;
