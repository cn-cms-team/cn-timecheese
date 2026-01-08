import type { Metadata } from 'next';
import { ReportTeamView } from '@/components/pages/report/team/view';

export const metadata: Metadata = {
  title: 'Report Team - Time Cheese',
  description: 'Time Cheese',
};

const ReportTeam = () => {
  return <ReportTeamView />;
};

export default ReportTeam;
