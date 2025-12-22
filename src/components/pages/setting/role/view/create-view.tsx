'use client';

import { useRouter } from 'next/navigation';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import RoleCreate from '../role-create';
import { IRole } from '@/types/setting/role';
import { useEffect, useState } from 'react';
const RoleCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex align-middle">
      <Button className="btn btn-outline-primary font-bold" type="submit" form="">
        บันทึก
      </Button>
      <Button
        className="btn btn-outline-secondary font-bold ml-2"
        onClick={() => router.push('/setting/role')}
      >
        ยกเลิก
      </Button>
    </div>
  );
};

const RoleCreateView = ({ id, data }: { id?: string; data?: IRole }) => {
  const fetchRolesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role/new`;
  const [rolePermissionList, setRolePermissionList] = useState<IRole>();
  const getRolesPermission = async () => {
    const response = await fetch(fetchRolesUrl);
    const result = await response.json();
    return result.data;
  };

  useEffect(() => {
    getRolesPermission().then((data) => {
      setRolePermissionList(data);
    });
  }, []);
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขสิทธิ์การใช้งาน' : 'เพิ่มสิทธิ์การใช้งาน'}
      leaveUrl="/setting/role"
      headerButton={<RoleCreateButton />}
      content={<RoleCreate data={rolePermissionList} />}
    ></ModuleLayout>
  );
};

export default RoleCreateView;
