import PostionListView from '@/components/pages/setting/position/view/index-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Position - Time Cheese',
  description: 'Time Cheese',
};

const PositionSetting = () => {
  return <PostionListView/>;
};

export default PositionSetting;
