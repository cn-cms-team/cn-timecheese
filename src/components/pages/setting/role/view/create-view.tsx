'use client';

import { useRouter } from 'next/navigation';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import RoleCreate from '../role-create';
const RoleCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex align-middle">
      <Button className="btn btn-outline-primary font-bold" type="submit" form="role-create-form">
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

const RoleCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขสิทธิ์การใช้งาน' : 'เพิ่มสิทธิ์การใช้งาน'}
      leaveUrl="/setting/role"
      headerButton={<RoleCreateButton />}
      content={<RoleCreate id={id} />}
    ></ModuleLayout>
  );
};

export default RoleCreateView;
