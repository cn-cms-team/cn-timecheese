import { OkrCreateView } from '@/components/pages/okrs/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create OKR - Time Cheese',
  description: 'Time Cheese',
};

const OkrCreatePage = () => {
  return <OkrCreateView />;
};

export default OkrCreatePage;
