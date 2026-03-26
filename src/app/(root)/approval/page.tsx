import { ApprovalView } from '@/components/pages/approval/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approval - Time Cheese',
  description: 'Time Cheese',
};

const ApprovalPage = () => {
  return <ApprovalView />;
};

export default ApprovalPage;
