import { HolidayListView } from '@/components/pages/setting/holiday/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Holiday - Time Cheese',
  description: 'Time Cheese',
};

const HolidaySetting = () => {
  return <HolidayListView />;
};

export default HolidaySetting;
