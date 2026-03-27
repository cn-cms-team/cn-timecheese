export type PomodoroPeriod = 'pomodoro' | 'break' | 'longBreak';

export interface PomodoroCounters {
  pomodoro: number;
  break: number;
  longBreak: number;
}

export interface PomodoroTask {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
}
