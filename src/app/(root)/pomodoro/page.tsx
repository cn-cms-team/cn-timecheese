import { PomodoroView } from '@/components/pages/pomodoro/view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pomodoro - Time Cheese',
  description: 'Time Cheese',
};

const PomodoroPage = () => {
  return <PomodoroView />;
};

export default PomodoroPage;
