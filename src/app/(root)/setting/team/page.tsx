import { TeamListView } from '@/components/pages/setting/team/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team - Time Cheese',
  description: 'Time Cheese',
};

const TeamSetting = () => {
  return <TeamListView />;
};

export default TeamSetting;
