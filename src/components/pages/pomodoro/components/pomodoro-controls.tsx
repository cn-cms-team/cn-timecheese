import { ListTodo, Music2, RotateCcw, Timer } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PomodoroControlsProps {
  isRunning: boolean;
  onToggleTimer: () => void;
  onOpenTasks: () => void;
  onOpenMusic: () => void;
}

const PomodoroControls = ({
  isRunning,
  onToggleTimer,
  onOpenTasks,
  onOpenMusic,
}: PomodoroControlsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <Button
        size="lg"
        variant="secondary"
        className="bg-white/15 text-white hover:bg-white/25"
        onClick={onOpenTasks}
        data-pomodoro-tour="tasks-button"
      >
        <ListTodo />
        Tasks
      </Button>
      <Button
        className="h-48 w-48 rounded-2xl bg-primary p-0 text-slate-800 sm:h-28 sm:w-28"
        onClick={onToggleTimer}
        data-pomodoro-tour="timer-button"
      >
        {isRunning ? (
          <RotateCcw className="h-12! w-12! sm:h-10! sm:w-10!" />
        ) : (
          <Timer className="h-12! w-12! sm:h-10! sm:w-10!" />
        )}
      </Button>
      <Button
        size="lg"
        variant="secondary"
        className="bg-white/15 text-white hover:bg-white/25"
        onClick={onOpenMusic}
        data-pomodoro-tour="music-button"
      >
        <Music2 />
        Music
      </Button>
    </div>
  );
};

export default PomodoroControls;
