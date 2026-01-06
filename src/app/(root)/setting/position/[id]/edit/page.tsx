import PositionCreateView from '@/components/pages/setting/position/view/create-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Position - Time Cheese',
  description: 'Time Cheese',
};

const PositionEditSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <PositionCreateView id={id} />;
};

export default PositionEditSetting;
