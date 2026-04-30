'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import OkrForm from '../okr-form';

const OkrCreateButtons = () => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => router.push('/okrs')}>
        ยกเลิก
      </Button>
      <Button type="submit" form="okr-form">
        บันทึก
      </Button>
    </div>
  );
};

const OkrCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไข OKR' : 'เพิ่ม OKR'}
      leaveUrl="/okrs"
      headerButton={<OkrCreateButtons />}
      content={<OkrForm id={id} />}
    />
  );
};

export default OkrCreateView;
