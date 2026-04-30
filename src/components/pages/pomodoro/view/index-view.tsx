'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CircleHelp, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import type { DriveStep, Driver } from 'driver.js';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Button } from '@/components/ui/button';

import { DEFAULT_POMODORO_TITLE, LOFI_PLAYLIST, PERIOD_LABELS, PERIOD_SECONDS } from '../constants';
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
const POMODORO_TOUR_STORAGE_KEY = 'pomodoro-tour-completed:v1';

const PomodoroView = () => {
  const [currentPeriod, setCurrentPeriod] = useState<PomodoroPeriod>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState<number>(PERIOD_SECONDS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [counters, setCounters] = useState<PomodoroCounters>(INITIAL_COUNTERS);
  const [tasks, setTasks] = useState<PomodoroTask[]>([]);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<string>(LOFI_PLAYLIST[0]?.id ?? '');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.6);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [musicCurrentTime, setMusicCurrentTime] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const [isTourMiniPlayerVisible, setIsTourMiniPlayerVisible] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(true);
  const [skipTourForSession, setSkipTourForSession] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastVolumeRef = useRef(0.6);
  const driverRef = useRef<Driver | null>(null);
  const hasCompletedTourRef = useRef(true);

  const formattedTime = useMemo(() => formatSecondsToClock(secondsLeft), [secondsLeft]);
  const activeTrack = useMemo(
    () => LOFI_PLAYLIST.find((track) => track.id === activeTrackId) ?? LOFI_PLAYLIST[0],
    [activeTrackId]
  );
  const safeMusicDuration = Number.isFinite(musicDuration) ? musicDuration : 0;
  const safeMusicCurrentTime = Math.min(Math.max(musicCurrentTime, 0), safeMusicDuration || 0);
  const remainingMusicSeconds = Math.max(safeMusicDuration - safeMusicCurrentTime, 0);

  const markTourAsCompleted = useCallback(() => {
    if (hasCompletedTourRef.current || typeof window === 'undefined') {
      return;
    }

    hasCompletedTourRef.current = true;
    setHasCompletedTour(true);
    setSkipTourForSession(true);
    window.localStorage.setItem(POMODORO_TOUR_STORAGE_KEY, 'true');
  }, []);

  const formatAudioTime = useCallback((seconds: number) => {
    const normalizedSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const minutes = Math.floor(normalizedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secondsPart = (normalizedSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${secondsPart}`;
  }, []);

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

  const handleSelectTrack = useCallback((trackId: string) => {
    setActiveTrackId(trackId);
  }, []);

  const handlePlayTrack = useCallback((trackId: string) => {
    setActiveTrackId(trackId);
    setIsMusicPlaying(true);
  }, []);

  const handleToggleMusicPlayback = useCallback(() => {
    const audioElement = musicAudioRef.current;
    if (!audioElement) {
      return;
    }

    if (audioElement.paused) {
      void audioElement.play().catch(() => {
        setIsMusicPlaying(false);
      });
      return;
    }

    audioElement.pause();
  }, []);

  const handlePlayNextTrack = useCallback(() => {
    if (!activeTrack || LOFI_PLAYLIST.length === 0) {
      return;
    }

    const currentTrackIndex = LOFI_PLAYLIST.findIndex((track) => track.id === activeTrack.id);
    const safeIndex = currentTrackIndex >= 0 ? currentTrackIndex : 0;
    const nextTrack = LOFI_PLAYLIST[(safeIndex + 1) % LOFI_PLAYLIST.length];

    setActiveTrackId(nextTrack.id);
    setIsMusicPlaying(true);
  }, [activeTrack]);

  const handlePlayPreviousTrack = useCallback(() => {
    if (!activeTrack || LOFI_PLAYLIST.length === 0) {
      return;
    }

    const currentTrackIndex = LOFI_PLAYLIST.findIndex((track) => track.id === activeTrack.id);
    const safeIndex = currentTrackIndex >= 0 ? currentTrackIndex : 0;
    const previousTrack =
      LOFI_PLAYLIST[(safeIndex - 1 + LOFI_PLAYLIST.length) % LOFI_PLAYLIST.length];

    setActiveTrackId(previousTrack.id);
    setIsMusicPlaying(true);
  }, [activeTrack]);

  const handleChangeMusicVolume = useCallback((value: number) => {
    const safeVolume = Math.min(1, Math.max(0, value));

    setMusicVolume(safeVolume);
    if (safeVolume > 0) {
      lastVolumeRef.current = safeVolume;
      setIsMusicMuted(false);
      return;
    }

    setIsMusicMuted(true);
  }, []);

  const handleToggleMusicMute = useCallback(() => {
    setIsMusicMuted((previousMuted) => {
      if (previousMuted) {
        const restoreVolume = lastVolumeRef.current > 0 ? lastVolumeRef.current : 0.6;
        setMusicVolume(restoreVolume);
        return false;
      }

      if (musicVolume > 0) {
        lastVolumeRef.current = musicVolume;
      }

      return true;
    });
  }, [musicVolume]);

  const handleSeekMusicPosition = useCallback((value: number) => {
    const audioElement = musicAudioRef.current;
    if (!audioElement) {
      return;
    }

    const safeValue = Math.min(
      Math.max(value, 0),
      Number.isFinite(audioElement.duration) ? audioElement.duration : 0
    );
    audioElement.currentTime = safeValue;
    setMusicCurrentTime(safeValue);
  }, []);

  const startPomodoroTour = useCallback(
    async (force = false) => {
      if (typeof window === 'undefined' || driverRef.current) {
        return;
      }

      const overview = document.querySelector('[data-pomodoro-tour="overview"]');
      const periodSelector = document.querySelector('[data-pomodoro-tour="period-selector"]');
      const timerDisplay = document.querySelector('[data-pomodoro-tour="timer-display"]');
      const timerButton = document.querySelector('[data-pomodoro-tour="timer-button"]');
      const tasksButton = document.querySelector('[data-pomodoro-tour="tasks-button"]');
      const musicButton = document.querySelector('[data-pomodoro-tour="music-button"]');
      const guideButton = document.querySelector('[data-pomodoro-tour="guide-button"]');

      if (
        !overview ||
        !periodSelector ||
        !timerDisplay ||
        !timerButton ||
        !tasksButton ||
        !musicButton ||
        !guideButton
      ) {
        return;
      }

      const { driver } = await import('driver.js');
      const defaultTrackId = activeTrackId || LOFI_PLAYLIST[0]?.id || '';

      const steps: DriveStep[] = [
        {
          element: '[data-pomodoro-tour="overview"]',
          popover: {
            title: 'Pomodoro คืออะไร',
            description:
              'Pomodoro คือเทคนิคแบ่งงานเป็นรอบสั้น เช่น 25 นาที แล้วพักสั้น ๆ เพื่อรักษาสมาธิ ลดความล้า และทำให้เห็นความคืบหน้าของงานชัดขึ้นในแต่ละรอบ',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-pomodoro-tour="period-selector"]',
          popover: {
            title: 'รอบการทำงานและตัวนับ',
            description:
              'แถวนี้ใช้สลับระหว่างช่วงทำงาน พักสั้น และพักยาว พร้อมนับจำนวนรอบที่ทำสำเร็จแล้ว เพื่อให้คุณวางจังหวะการทำงานได้เป็นระบบ',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-pomodoro-tour="timer-display"]',
          popover: {
            title: 'ตัวจับเวลาหลัก',
            description:
              'เวลาตรงกลางคือเวลาคงเหลือของรอบปัจจุบัน ระหว่างที่กำลังนับ หน้าเว็บจะเปลี่ยน title ของแท็บตามเวลาเพื่อให้มองเห็นได้แม้สลับไปทำงานอย่างอื่น',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-pomodoro-tour="timer-button"]',
          popover: {
            title: 'เริ่มหรือรีเซ็ตรอบ',
            description:
              'ปุ่มใหญ่ตรงกลางใช้เริ่มจับเวลา เมื่อรอบกำลังทำงานอยู่ ปุ่มนี้จะกลายเป็นการรีเซ็ตกลับไปยังค่าเริ่มต้นของช่วงนั้นทันที',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '[data-pomodoro-tour="tasks-button"]',
          popover: {
            title: 'จัดการงานที่จะโฟกัส',
            description:
              'ปุ่ม Tasks ใช้เปิดรายการงานที่อยากโฟกัสในรอบนี้ การกำหนดงานให้ชัดจะช่วยให้แต่ละ pomodoro มีเป้าหมายที่วัดผลได้',
            side: 'top',
            align: 'center',
            onNextClick: (_element, _step, options) => {
              setIsTasksModalOpen(true);

              window.setTimeout(() => {
                options.driver.moveNext();
              }, 250);
            },
          },
        },
        {
          element: '[data-pomodoro-tour="tasks-input"]',
          popover: {
            title: 'เพิ่มงานใหม่',
            description:
              'พิมพ์ชื่องานแล้วกด Add หรือ Enter เพื่อเพิ่มรายการใหม่ แนะนำให้แตกงานให้เล็กพอที่จะทำจบได้ใน 1 ถึง 2 รอบ',
            side: 'bottom',
            align: 'center',
            onPrevClick: (_element, _step, options) => {
              setIsTasksModalOpen(false);

              window.setTimeout(() => {
                options.driver.movePrevious();
              }, 150);
            },
          },
        },
        {
          element: '[data-pomodoro-tour="tasks-list"]',
          popover: {
            title: 'เช็กเสร็จ แก้ไข และลบงาน',
            description:
              'ในรายการนี้คุณสามารถติ๊กงานที่เสร็จ แก้ชื่อ หรือเอางานที่ไม่จำเป็นออกได้ เพื่อให้รายการสะอาดและสะท้อนสิ่งที่กำลังทำจริง',
            side: 'top',
            align: 'center',
            onNextClick: (_element, _step, options) => {
              setIsTasksModalOpen(false);

              window.setTimeout(() => {
                options.driver.moveNext();
              }, 150);
            },
          },
        },
        {
          element: '[data-pomodoro-tour="music-button"]',
          popover: {
            title: 'เปิดเพลงช่วยโฟกัส',
            description:
              'ปุ่ม Music จะเปิดคลังเพลง lofi สำหรับสร้างบรรยากาศที่นิ่งและต่อเนื่องระหว่างทำงาน',
            side: 'top',
            align: 'center',
            onPrevClick: (_element, _step, options) => {
              setIsTasksModalOpen(true);

              window.setTimeout(() => {
                options.driver.movePrevious();
              }, 250);
            },
            onNextClick: (_element, _step, options) => {
              setIsMusicModalOpen(true);

              window.setTimeout(() => {
                options.driver.moveNext();
              }, 250);
            },
          },
        },
        {
          element: '[data-pomodoro-tour="music-player"]',
          popover: {
            title: 'ตัวเล่นเพลงหลัก',
            description:
              'ส่วนบนของ modal ใช้เล่นหรือหยุดเพลง ปรับตำแหน่งเวลา และปรับระดับเสียงหรือ mute ได้ทันที',
            side: 'left',
            align: 'start',
            onPrevClick: (_element, _step, options) => {
              setIsMusicModalOpen(false);

              window.setTimeout(() => {
                options.driver.movePrevious();
              }, 150);
            },
          },
        },
        {
          element: '[data-pomodoro-tour="music-playlist"]',
          popover: {
            title: 'เลือกเพลงจากเพลย์ลิสต์',
            description:
              'ด้านล่างคือรายการเพลงทั้งหมด เลือกเพลงที่ต้องการแล้วกดเล่นได้ทันที ระบบจะจำ track ที่กำลัง active ไว้ให้',
            side: 'left',
            align: 'start',
            onNextClick: (_element, _step, options) => {
              if (defaultTrackId) {
                handlePlayTrack(defaultTrackId);
              }

              setIsTourMiniPlayerVisible(true);
              setIsMusicModalOpen(false);

              window.setTimeout(() => {
                options.driver.moveNext();
              }, 200);
            },
          },
        },
        {
          element: '[data-pomodoro-tour="mini-player"]',
          popover: {
            title: 'มินิเพลเยอร์มุมจอ',
            description:
              'เมื่อเพลงกำลังเล่น จะมีมินิเพลเยอร์ลอยขึ้นมาให้ควบคุม mute ย้อนเพลง ข้ามเพลง ปรับตำแหน่ง และดูเวลาที่เหลือได้โดยไม่ต้องเปิด modal อีกครั้ง',
            side: 'left',
            align: 'end',
          },
        },
        {
          element: '[data-pomodoro-tour="guide-button"]',
          popover: {
            title: 'ดูคำแนะนำอีกครั้ง',
            description:
              'หากต้องการทบทวนวิธีใช้งานทั้งหมด ให้กดปุ่ม Guide ด้านบนได้ทุกเมื่อ เมื่อจบทัวร์ครั้งนี้ ระบบจะจำว่าคุณดูครบแล้วและจะไม่เด้งอัตโนมัติซ้ำ',
            side: 'bottom',
            align: 'end',
            onNextClick: (_element, _step, options) => {
              markTourAsCompleted();
              options.driver.destroy();
            },
          },
        },
      ];

      const driverInstance = driver({
        allowClose: false,
        allowKeyboardControl: true,
        animate: true,
        doneBtnText: 'เสร็จแล้ว',
        nextBtnText: 'ถัดไป',
        overlayOpacity: 0.72,
        popoverClass: 'timesheet-tour-popover',
        prevBtnText: 'ย้อนกลับ',
        showButtons: ['previous', 'next'],
        showProgress: true,
        smoothScroll: true,
        stagePadding: 12,
        stageRadius: 16,
        steps,
        onDestroyed: () => {
          driverRef.current = null;
          setIsTourMiniPlayerVisible(false);

          if (!hasCompletedTourRef.current && !force) {
            setSkipTourForSession(true);
          }
        },
      });

      if (force) {
        setSkipTourForSession(true);
      }

      driverRef.current = driverInstance;
      driverInstance.drive();
    },
    [activeTrackId, handlePlayTrack, markTourAsCompleted]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    hasCompletedTourRef.current = window.localStorage.getItem(POMODORO_TOUR_STORAGE_KEY) === 'true';
    setHasCompletedTour(hasCompletedTourRef.current);
  }, []);

  useEffect(() => {
    if (hasCompletedTour || skipTourForSession || isTasksModalOpen || isMusicModalOpen) {
      return;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (isCancelled) {
        return;
      }

      void startPomodoroTour();
    }, 400);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [hasCompletedTour, isMusicModalOpen, isTasksModalOpen, skipTourForSession, startPomodoroTour]);

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
    const audioElement = musicAudioRef.current;
    if (!audioElement || !activeTrack) {
      return;
    }

    setMusicCurrentTime(0);
    setMusicDuration(0);

    if (isMusicPlaying) {
      void audioElement.play().catch(() => {
        setIsMusicPlaying(false);
      });
      return;
    }

    audioElement.pause();
  }, [activeTrack, isMusicPlaying]);

  useEffect(() => {
    const audioElement = musicAudioRef.current;
    if (!audioElement) {
      return;
    }

    audioElement.volume = musicVolume;
    audioElement.muted = isMusicMuted;
  }, [isMusicMuted, musicVolume]);

  useEffect(() => {
    return () => {
      clearTimer();
      document.title = DEFAULT_POMODORO_TITLE;
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, [clearTimer]);

  return (
    <>
      <ModuleLayout
        headerTitle="Pomodoro"
        headerButton={
          <Button
            variant="secondary"
            className="gap-2"
            data-pomodoro-tour="guide-button"
            onClick={() => {
              if (driverRef.current?.isActive()) {
                return;
              }

              setIsTasksModalOpen(false);
              setIsMusicModalOpen(false);
              void startPomodoroTour(true);
            }}
          >
            <CircleHelp />
            Guide
          </Button>
        }
        content={
          <section
            className="relative overflow-hidden rounded-xl p-4 sm:p-6 md:p-8 lg:p-10"
            style={{ minHeight: 'calc(100dvh - 9.5rem)' }}
            data-pomodoro-tour="overview"
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

              <p
                className="font-black tracking-tight text-white text-7xl sm:text-8xl md:text-9xl lg:text-[13rem]"
                data-pomodoro-tour="timer-display"
              >
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

      <MusicModal
        open={isMusicModalOpen}
        onOpenChange={setIsMusicModalOpen}
        playlist={LOFI_PLAYLIST}
        activeTrackId={activeTrack?.id ?? ''}
        isPlaying={isMusicPlaying}
        onSelectTrack={handleSelectTrack}
        onPlayTrack={handlePlayTrack}
        currentTime={safeMusicCurrentTime}
        duration={safeMusicDuration}
        onSeek={handleSeekMusicPosition}
        onTogglePlay={handleToggleMusicPlayback}
        volume={musicVolume}
        isMuted={isMusicMuted}
        onChangeVolume={handleChangeMusicVolume}
        onToggleMute={handleToggleMusicMute}
      />

      {activeTrack && (
        <audio
          ref={musicAudioRef}
          src={activeTrack.url}
          preload="none"
          onPlay={() => setIsMusicPlaying(true)}
          onPause={() => setIsMusicPlaying(false)}
          onTimeUpdate={(event) => setMusicCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setMusicDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setMusicDuration(event.currentTarget.duration)}
          onEnded={handlePlayNextTrack}
          className="hidden"
        />
      )}

      {(isMusicPlaying || isTourMiniPlayerVisible) && activeTrack && (
        <div
          className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/20 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-md"
          data-pomodoro-tour="mini-player"
        >
          <p className="truncate text-sm font-semibold">{activeTrack.title}</p>
          <p className="truncate text-xs text-white/75">{activeTrack.artist}</p>

          <div className="mt-3 flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="icon-sm"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={handleToggleMusicMute}
            >
              {isMusicMuted ? <VolumeX /> : <Volume2 />}
              <span className="sr-only">Toggle mute</span>
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={handlePlayPreviousTrack}
            >
              <SkipBack />
              <span className="sr-only">Previous track</span>
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={handleToggleMusicPlayback}
            >
              {isMusicPlaying ? <Pause /> : <Play />}
              <span className="sr-only">Play or pause music</span>
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={handlePlayNextTrack}
            >
              <SkipForward />
              <span className="sr-only">Next track</span>
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={safeMusicDuration || 0}
              step={0.1}
              value={safeMusicCurrentTime}
              onChange={(event) => handleSeekMusicPosition(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-white"
              aria-label="Mini player progress"
              disabled={safeMusicDuration <= 0}
            />
            <span className="w-14 text-right text-xs text-white/80">
              -{formatAudioTime(remainingMusicSeconds)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMusicMuted ? 0 : musicVolume}
              onChange={(event) => handleChangeMusicVolume(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-white opacity-20"
              aria-label="Mini player volume"
            />
            <span className="w-10 text-right text-xs text-white/80">
              {Math.round((isMusicMuted ? 0 : musicVolume) * 100)}%
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default PomodoroView;
