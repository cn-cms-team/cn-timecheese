'use client';

import { useRouter } from 'next/navigation';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import RoleViewDetail from '../role-view';

const RoleViewButton = ({ id }: { id: string }): React.ReactNode => {
  const router = useRouter();
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role/${id}`;
  const deleteUser = async () => {
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/role');
    });
  };
  return (
    <div className="flex gap-2 align-middle">
      <Button onClick={() => router.push(`/setting/role/${id}/edit`)}>แก้ไข</Button>
      <Button variant={'destructive'} onClick={() => deleteUser()}>
        ลบ
      </Button>
    </div>
  );
};

const RoleView = ({ id }: { id: string }) => {
  return (
    <ModuleLayout
      headerTitle={'รายละเอียดสิทธิ์การใช้งาน'}
      leaveUrl="/setting/role"
      headerButton={<RoleViewButton id={id} />}
      content={<RoleViewDetail id={id} />}
    ></ModuleLayout>
  );
};

export default RoleView;
