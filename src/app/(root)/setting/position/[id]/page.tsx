
import PositionView from '@/components/pages/setting/position/view/detail-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Position - Time Cheese',
  description: 'Time Cheese',
};

const PositionViewSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <PositionView id={id} />;
};

export default PositionViewSetting;
