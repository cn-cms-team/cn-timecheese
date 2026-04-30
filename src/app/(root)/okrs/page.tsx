import { OKRsView } from '@/components/pages/okrs/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OKRs - Time Cheese',
  description: 'Time Cheese',
};

const OKRsPage = () => {
  return <OKRsView />;
};

export default OKRsPage;
