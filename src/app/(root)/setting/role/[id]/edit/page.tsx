import { RoleCreateView } from '@/components/pages/setting/role/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Role - Time Cheese',
  description: 'Time Cheese',
};

const RoleEditSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <RoleCreateView id={id} />;
};

export default RoleEditSetting;
