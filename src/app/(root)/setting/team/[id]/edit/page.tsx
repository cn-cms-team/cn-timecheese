import { TeamCreateView } from '@/components/pages/setting/team/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Team - CN Timesheet',
  description: 'CN Timesheet',
};

const TeamCreateSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TeamCreateView id={id} />;
};

export default TeamCreateSetting;
