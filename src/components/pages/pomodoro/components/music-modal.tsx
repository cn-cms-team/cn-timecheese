import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { LofiTrack } from '../types';

interface MusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist: LofiTrack[];
  activeTrackId: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayTrack: (trackId: string) => void;
  onSelectTrack: (trackId: string) => void;
  onSeek: (value: number) => void;
  onTogglePlay: () => void;
  volume: number;
  isMuted: boolean;
  onChangeVolume: (value: number) => void;
  onToggleMute: () => void;
}

const MusicModal = ({
  open,
  onOpenChange,
  playlist,
  activeTrackId,
  isPlaying,
  currentTime,
  duration,
  onPlayTrack,
  onSelectTrack,
  onSeek,
  onTogglePlay,
  volume,
  isMuted,
  onChangeVolume,
  onToggleMute,
}: MusicModalProps) => {
  const activeTrack = playlist.find((track) => track.id === activeTrackId) ?? playlist[0];
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeCurrentTime = Math.min(Math.max(currentTime, 0), safeDuration || 0);
  const remainingSeconds = Math.max(safeDuration - safeCurrentTime, 0);

  const formatAudioTime = (seconds: number) => {
    const normalizedSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const minutes = Math.floor(normalizedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secondsPart = (normalizedSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${secondsPart}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Music</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {activeTrack && (
            <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#7c3aed]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7c3aed]">
                      Lofi
                    </span>
                    {isPlaying && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                        Playing
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold leading-tight">
                    {activeTrack.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{activeTrack.artist}</p>
                </div>

                <Button size="icon-sm" onClick={onTogglePlay}>
                  {isPlaying ? <Pause /> : <Play />}
                  <span className="sr-only">Play or pause</span>
                </Button>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={safeDuration || 0}
                  step={0.1}
                  value={safeCurrentTime}
                  onChange={(event) => onSeek(Number(event.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-primary"
                  aria-label="Track progress"
                  disabled={safeDuration <= 0}
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatAudioTime(safeCurrentTime)}</span>
                  <span>-{formatAudioTime(remainingSeconds)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="icon-sm" variant="secondary" onClick={onToggleMute}>
                  {isMuted ? <VolumeX /> : <Volume2 />}
                  <span className="sr-only">Toggle mute</span>
                </Button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(event) => onChangeVolume(Number(event.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-primary"
                  aria-label="Music volume"
                />
                <span className="w-9 text-right text-[11px] text-muted-foreground">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          )}

          <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1 pb-2">
            {playlist.map((track) => {
              const isActive = track.id === activeTrackId;

              return (
                <button
                  key={track.id}
                  type="button"
                  className="w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-left transition hover:bg-muted/40 shadow-sm"
                  onClick={() => onSelectTrack(track.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{track.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{track.artist}</p>
                    </div>

                    <Button
                      size="icon-sm"
                      variant={isActive && isPlaying ? 'default' : 'secondary'}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (isActive && isPlaying) {
                          onTogglePlay();
                          return;
                        }

                        onPlayTrack(track.id);
                      }}
                    >
                      {isActive && isPlaying ? <Pause /> : <Play />}
                      <span className="sr-only">Play track</span>
                    </Button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MusicModal;
