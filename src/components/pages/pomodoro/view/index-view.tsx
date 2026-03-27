'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastVolumeRef = useRef(0.6);

  const formattedTime = useMemo(() => formatSecondsToClock(secondsLeft), [secondsLeft]);
  const activeTrack = useMemo(
    () => LOFI_PLAYLIST.find((track) => track.id === activeTrackId) ?? LOFI_PLAYLIST[0],
    [activeTrackId]
  );
  const safeMusicDuration = Number.isFinite(musicDuration) ? musicDuration : 0;
  const safeMusicCurrentTime = Math.min(Math.max(musicCurrentTime, 0), safeMusicDuration || 0);
  const remainingMusicSeconds = Math.max(safeMusicDuration - safeMusicCurrentTime, 0);

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

      {isMusicPlaying && activeTrack && (
        <div className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/20 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-md">
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
              className="h-2 w-full cursor-pointer accent-white"
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
