'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import UserViewDetail from '../user-view';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { useAccount } from '@/components/context/app-context';
import { EModules } from '@/lib/constants/module';

const UserViewButton = ({ id }: { id: string }): React.ReactNode => {
  const { account } = useAccount();
  const router = useRouter();
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/user/${id}`;
  const deleteUser = async () => {
    await fetch(fetchUrl, { method: 'DELETE' }).then(() => {
      router.push('/setting/user');
    });
  };
  const canEdit = renderByPermission(account, EModules.ADMIN_USER, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_USER, 'DELETE');
  if (!canEdit && !canDelete) {
    return <></>;
  }
  return (
    <div className="flex gap-2 items-center">
      {canEdit && (
        <>
          <Link href={`/setting/user/${id}/reset-password`}>
            <Button variant={'outline'} className="bg-transparent">
              รีเซ็ตรหัสผ่าน
            </Button>
          </Link>

          <Button onClick={() => router.push(`/setting/user/${id}/edit`)}>แก้ไข</Button>
        </>
      )}
      {canDelete && (
        <Button variant={'destructive'} onClick={() => deleteUser()}>
          ลบ
        </Button>
      )}
    </div>
  );
};

const UserView = ({ id }: { id: string }) => {
  return (
    <ModuleLayout
      headerTitle={'รายละเอียดผู้ใช้งาน'}
      leaveUrl={'/setting/user'}
      headerButton={<UserViewButton id={id} />}
      content={<UserViewDetail id={id} />}
    ></ModuleLayout>
  );
};
export default UserView;
