'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import TeamCreate from '../team-create';
import { useRouter } from 'next/navigation';

const TeamCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <Button variant={'outline'} onClick={() => router.push('/setting/team')}>
        ยกเลิก
      </Button>
      <Button type="submit" form="team-create-form">
        บันทึก
      </Button>
    </div>
  );
};

const TeamCreateView = ({ id }: { id?: string }) => {
  return (
    <ModuleLayout
      headerTitle={id ? 'แก้ไขทีม' : 'เพิ่มทีม'}
      leaveUrl={'/setting/team'}
      headerButton={<TeamCreateButton />}
      content={<TeamCreate id={id} />}
    ></ModuleLayout>
  );
};
export default TeamCreateView;
