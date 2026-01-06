import { DashboardView } from '@/components/pages/dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Time Cheese',
  description: 'Time Cheese',
};

const DashboardPage = () => {
  return <DashboardView />;
};

export default DashboardPage;
