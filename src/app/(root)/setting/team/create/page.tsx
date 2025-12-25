import { TeamCreateView } from '@/components/pages/setting/team/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Team - Time Cheese',
  description: 'Time Cheese',
};

const TeamCreateSetting = async () => {
  return <TeamCreateView />;
};

export default TeamCreateSetting;
