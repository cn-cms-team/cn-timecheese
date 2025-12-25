'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import PostionCreate from '../postion-create';
import { useRouter, useSearchParams } from 'next/navigation';

const PositionCreateButton = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const returnUrl = from === 'detail' ? `/setting/position/${id}` : `/setting/position`;
  return (
    <div className="flex items-middle gap-2">
      <Button
        className="btn btn-outline font-bold"
        variant={'outline'}
        onClick={() => router.push(returnUrl)}
      >
        ยกเลิก
      </Button>
      <Button
        className="btn btn-outline-primary font-bold"
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
