'use client';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';
import TeamCreate from '../team-create';
import { useRouter } from 'next/navigation';

const TeamCreateButton = (): React.ReactNode => {
  const router = useRouter();
  return (
    <div className="flex align-middle">
      <Button className="btn btn-outline-primary font-bold" type="submit" form="team-create-form">
        บันทึก
      </Button>
      <Button
        className="btn btn-outline-secondary font-bold ml-2"
        onClick={() => router.push('/setting/team')}
      >
        ยกเลิก
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
