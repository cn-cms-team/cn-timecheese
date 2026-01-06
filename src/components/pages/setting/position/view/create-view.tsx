'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import PostionCreate from '../postion-create';
import { useRouter } from 'next/navigation';

const PositionCreateButton = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex items-middle gap-2">
      <Button
        variant={'outline'}
        onClick={() => router.push(`/setting/position`)}
      >
        ยกเลิก
      </Button>
      <Button
        type="submit"
        form="position-create-form"
      >
        บันทึก
      </Button>
    </div>
  );
};

const PositionCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขตำแหน่ง' : 'เพิ่มตำแหน่ง'}
      leaveUrl={'/setting/position'}
      headerButton={<PositionCreateButton id={id} />}
      content={<PostionCreate id={id} />}
    ></ModuleLayout>
  );
};
export default PositionCreateView;
