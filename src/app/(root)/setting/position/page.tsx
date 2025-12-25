import PostionListView from '@/components/pages/setting/position/view/index-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ตั้งค่าตำแหน่งงาน - Timecheese',
  description: 'Timecheese',
};

const PositionSetting = () => {
  return <PostionListView/>;
};

export default PositionSetting;
