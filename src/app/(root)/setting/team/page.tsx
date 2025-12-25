import { TeamListView } from '@/components/pages/setting/team/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team - CN Timesheet',
  description: 'CN Timesheet',
};

const TeamSetting = () => {
  return <TeamListView />;
};

export default TeamSetting;
