import type { PomodoroPeriod } from './types';

export const PERIOD_SECONDS: Record<PomodoroPeriod, number> = {
  pomodoro: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

export const PERIOD_LABELS: Record<PomodoroPeriod, string> = {
  pomodoro: 'pomodoros',
  break: 'breaks',
  longBreak: 'long breaks',
};

export const PERIOD_BUTTON_LABELS: Record<PomodoroPeriod, string> = {
  pomodoro: 'Pomodoro',
  break: 'Break',
  longBreak: 'Long Break',
};

export const DEFAULT_POMODORO_TITLE = 'Pomodoro - Time Cheese';
