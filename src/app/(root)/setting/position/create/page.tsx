import PostionCreateView from '@/components/pages/setting/position/view/create-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Postion - CN Timesheet',
  description: 'CN Timesheet',
};

const PositionCreateSetting = async () => {
  return <PostionCreateView />;
};

export default PositionCreateSetting;
