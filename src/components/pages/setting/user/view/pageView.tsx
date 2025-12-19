'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import UserViewDetail from '../user-view';
import { useRouter } from 'next/navigation';

const UserViewButton = ({ id }: { id: string }): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex align-middle">
      <Button
        className="btn btn-outline-primary font-bold"
        onClick={() => router.push(`/setting/user/${id}/edit`)}
      >
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

const UserView = ({ id }: { id: string }) => {
  return (
    <ModuleLayout
      headerTitle={'รายละเอียดผู้ใช้งาน'}
      headerButton={<UserViewButton id={id} />}
      content={<UserViewDetail />}
    ></ModuleLayout>
  );
};
export default UserView;
