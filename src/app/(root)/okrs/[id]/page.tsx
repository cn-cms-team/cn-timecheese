import { OkrDetailView } from '@/components/pages/okrs/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View OKR - Time Cheese',
  description: 'Time Cheese',
};

const OkrDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <OkrDetailView id={id} />;
};

export default OkrDetailPage;
