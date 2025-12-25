import TeamView from '@/components/pages/setting/team/view/detail-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Team - Time Cheese',
  description: 'Time Cheese',
};

const TeamViewSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TeamView id={id} />;
};

export default TeamViewSetting;
