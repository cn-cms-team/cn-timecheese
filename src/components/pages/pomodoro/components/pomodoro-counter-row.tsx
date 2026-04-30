import { PERIOD_LABELS } from '../constants';
import type { PomodoroCounters, PomodoroPeriod } from '../types';
import { cn } from '@/lib/utils';

interface PomodoroCounterRowProps {
  counters: PomodoroCounters;
  currentPeriod: PomodoroPeriod;
  onPeriodChange: (period: PomodoroPeriod) => void;
  disabled?: boolean;
}

const PERIOD_ORDER: PomodoroPeriod[] = ['pomodoro', 'break', 'longBreak'];

const PomodoroCounterRow = ({
  counters,
  currentPeriod,
  onPeriodChange,
  disabled = false,
}: PomodoroCounterRowProps) => {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      data-pomodoro-tour="period-selector"
    >
      {PERIOD_ORDER.map((period) => (
        <button
          type="button"
          key={period}
          onClick={() => onPeriodChange(period)}
          disabled={disabled}
          className={cn(
            'cursor-pointer rounded-2xl px-4 py-2 text-sm font-bold transition-colors sm:px-5 sm:py-3 sm:text-lg',
            period === currentPeriod
              ? 'bg-white/15 text-white'
              : 'bg-transparent text-white/90 hover:bg-white/10 hover:text-white',
            disabled && 'cursor-not-allowed opacity-70'
          )}
        >
          <span className="text-2xl leading-none sm:text-4xl">{counters[period]}</span>{' '}
          <span>{PERIOD_LABELS[period]}</span>
        </button>
      ))}
    </div>
  );
};

export default PomodoroCounterRow;
