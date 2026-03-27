'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ModuleLayout from '@/components/layouts/ModuleLayout';

import { DEFAULT_POMODORO_TITLE, PERIOD_LABELS, PERIOD_SECONDS } from '../constants';
import type { PomodoroCounters, PomodoroPeriod, PomodoroTask } from '../types';
import { formatSecondsToClock } from '../utils';
import MusicModal from '../components/music-modal';
import PomodoroControls from '../components/pomodoro-controls';
import PomodoroCounterRow from '../components/pomodoro-counter-row';
import TasksModal from '../components/tasks-modal';

const INITIAL_COUNTERS: PomodoroCounters = {
  pomodoro: 0,
  break: 0,
  longBreak: 0,
};

const POMODOROS_PER_LONG_BREAK = 4;

const PomodoroView = () => {
  const [currentPeriod, setCurrentPeriod] = useState<PomodoroPeriod>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState<number>(PERIOD_SECONDS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [counters, setCounters] = useState<PomodoroCounters>(INITIAL_COUNTERS);
  const [tasks, setTasks] = useState<PomodoroTask[]>([]);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const formattedTime = useMemo(() => formatSecondsToClock(secondsLeft), [secondsLeft]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playCompletionSound = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) {
        return;
      }

      const context = audioContextRef.current ?? new AudioContextCtor();
      audioContextRef.current = context;

      if (context.state === 'suspended') {
        void context.resume();
      }

      const now = context.currentTime;
      const pulseCount = 6;
      const pulseDuration = 0.2;
      const pulseGap = 0.1;

      for (let index = 0; index < pulseCount; index += 1) {
        const pulseStart = now + index * (pulseDuration + pulseGap);
        const pulseEnd = pulseStart + pulseDuration;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(index % 2 === 0 ? 980 : 760, pulseStart);

        gainNode.gain.setValueAtTime(0.0001, pulseStart);
        gainNode.gain.exponentialRampToValueAtTime(0.24, pulseStart + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, pulseEnd);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(pulseStart);
        oscillator.stop(pulseEnd + 0.01);
      }
    } catch {
      // Ignore audio playback failures on restricted browsers.
    }
  }, []);

  const stopAndResetToCurrentPeriod = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setSecondsLeft(PERIOD_SECONDS[currentPeriod]);
  }, [clearTimer, currentPeriod]);

  const getNextPeriod = useCallback(
    (period: PomodoroPeriod, nextCounters: PomodoroCounters): PomodoroPeriod => {
      if (period === 'pomodoro') {
        return nextCounters.pomodoro % POMODOROS_PER_LONG_BREAK === 0 ? 'longBreak' : 'break';
      }

      return 'pomodoro';
    },
    []
  );

  const handlePeriodChange = useCallback(
    (nextPeriod: PomodoroPeriod) => {
      setCurrentPeriod(nextPeriod);
      clearTimer();
      setIsRunning(false);
      setSecondsLeft(PERIOD_SECONDS[nextPeriod]);
    },
    [clearTimer]
  );

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handleToggleTimer = useCallback(() => {
    if (isRunning) {
      stopAndResetToCurrentPeriod();
      return;
    }

    handleStart();
  }, [handleStart, isRunning, stopAndResetToCurrentPeriod]);

  const handleAddTask = useCallback((title: string) => {
    setTasks((prevTasks) => [
      {
        id: crypto.randomUUID(),
        title,
        isCompleted: false,
        createdAt: Date.now(),
      },
      ...prevTasks,
    ]);
  }, []);

  const handleEditTask = useCallback((id: string, title: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, title } : task)));
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const handleToggleTaskComplete = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task))
    );
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    clearTimer();

    intervalRef.current = setInterval(() => {
      setSecondsLeft((previousSeconds) => Math.max(previousSeconds - 1, 0));
    }, 1000);

    return clearTimer;
  }, [clearTimer, isRunning]);

  useEffect(() => {
    if (!isRunning || secondsLeft !== 0) {
      return;
    }

    clearTimer();
    setIsRunning(false);

    const nextCounters = {
      ...counters,
      [currentPeriod]: counters[currentPeriod] + 1,
    };

    const nextPeriod = getNextPeriod(currentPeriod, nextCounters);
    setCounters(nextCounters);
    setCurrentPeriod(nextPeriod);
    setSecondsLeft(PERIOD_SECONDS[nextPeriod]);
    playCompletionSound();
  }, [
    clearTimer,
    counters,
    currentPeriod,
    getNextPeriod,
    isRunning,
    playCompletionSound,
    secondsLeft,
  ]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (isRunning) {
      document.title = `${formattedTime} - ${PERIOD_LABELS[currentPeriod]}`;
      return;
    }

    document.title = DEFAULT_POMODORO_TITLE;
  }, [currentPeriod, formattedTime, isRunning]);

  useEffect(() => {
    return () => {
      clearTimer();
      document.title = DEFAULT_POMODORO_TITLE;
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, [clearTimer]);

  return (
    <>
      <ModuleLayout
        headerTitle="Pomodoro"
        content={
          <section
            className="relative overflow-hidden rounded-xl p-4 sm:p-6 md:p-8 lg:p-10"
            style={{ minHeight: 'calc(100dvh - 9.5rem)' }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/img/general/pomodoro-bg.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className="absolute inset-0 bg-black/45" />

            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-between gap-8 py-4 text-white sm:gap-10 md:py-8">
              <PomodoroCounterRow
                counters={counters}
                currentPeriod={currentPeriod}
                onPeriodChange={handlePeriodChange}
                disabled={isRunning}
              />

              <p className="font-black tracking-tight text-white text-7xl sm:text-8xl md:text-9xl lg:text-[13rem]">
                {formattedTime}
              </p>

              <p className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
                “Work hard in silence, let your success be your noise.”.
              </p>

              <PomodoroControls
                isRunning={isRunning}
                onToggleTimer={handleToggleTimer}
                onOpenTasks={() => setIsTasksModalOpen(true)}
                onOpenMusic={() => setIsMusicModalOpen(true)}
              />
            </div>
          </section>
        }
      />

      <TasksModal
        open={isTasksModalOpen}
        onOpenChange={setIsTasksModalOpen}
        tasks={tasks}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onToggleTaskComplete={handleToggleTaskComplete}
      />

      <MusicModal open={isMusicModalOpen} onOpenChange={setIsMusicModalOpen} />
    </>
  );
};

export default PomodoroView;
