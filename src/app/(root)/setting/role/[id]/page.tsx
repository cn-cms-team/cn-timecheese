import { RoleView } from '@/components/pages/setting/role/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Role - CN Timecheet',
  description: 'CN Timecheet',
};

const RoleViewSetting = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <RoleView id={id} />;
};

export default RoleViewSetting;
