'use client';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { RoleList } from '../role-list';
import { IRole } from '@/types/setting/role';

import { useEffect, useState } from 'react';
import { createColumns } from '../role-list-column';

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
const columns = createColumns({
  onOpenDialog: () => {},
});
const RoleListView = () => {
  const router = useRouter();
  const fetchRolesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role`;
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const getRoles = async () => {
    const response = await fetch(fetchRolesUrl);
    const result = await response.json();
    return result.data;
  };

  useEffect(() => {
    getRoles().then((data) => {
      setRoleList(data);
    });
  }, []);

  return (
    <>
      <ModuleLayout
        headerTitle="สิทธิ์การใช้งาน"
        headerButton={<RoleButton />}
        content={<RoleList columns={columns} data={roleList} />}
      ></ModuleLayout>
    </>
  );
};
export default RoleListView;
