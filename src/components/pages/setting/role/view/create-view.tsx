'use client';

import { useRouter } from 'next/navigation';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import RoleCreate from '../role-create';
const RoleCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex gap-2 align-middle">
      <Button variant={'outline'} onClick={() => router.push('/setting/role')}>
        ยกเลิก
      </Button>
      <Button type="submit" form="role-create-form">
        บันทึก
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
