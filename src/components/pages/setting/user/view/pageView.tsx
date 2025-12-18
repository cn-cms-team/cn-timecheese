'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';

const UserCreateButton = (): React.ReactNode => {
  return (
    <div className="flex align-middle gap-4">
      <Button className="btn btn-outline-primary font-bold" onClick={() => console.log('Edit')}>
        แก้ไข
      </Button>
      <Button
        className="btn btn-outline-secondary font-bold ml-2"
        onClick={() => console.log('Delete')}
      >
        ลบ
      </Button>
    </div>
  );
};

const UserView = () => {
  return (
    <ModuleLayout
      headerTitle={'รายละเอียดผู้ใช้งาน'}
      headerButton={<UserCreateButton />}
      content={<div>View</div>}
    ></ModuleLayout>
  );
};
export default UserView;
