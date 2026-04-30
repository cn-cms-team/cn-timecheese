import { OkrCreateView } from '@/components/pages/okrs/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit OKR - Time Cheese',
  description: 'Time Cheese',
};

const OkrEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <OkrCreateView id={id} />;
};

export default OkrEditPage;
