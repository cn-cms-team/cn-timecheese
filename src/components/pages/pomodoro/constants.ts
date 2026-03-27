import type { LofiTrack, PomodoroPeriod } from './types';

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

export const LOFI_PLAYLIST: LofiTrack[] = [
  {
    id: 'wallpaper',
    title: 'Wallpaper',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wallpaper.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: 'cool-vibes',
    title: 'Cool Vibes',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cool%20Vibes.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: 'mining-by-moonlight',
    title: 'Mining by Moonlight',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Mining%20by%20Moonlight.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: 'airport-lounge',
    title: 'Airport Lounge',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Airport%20Lounge.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: 'evening-fall-harp',
    title: 'Evening Fall (Harp)',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening%20Fall%20-%20Harp.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: 'lost-tune',
    title: 'Good Night - Lofi Cozy Chill Music',
    artist: 'FASSounds',
    url: 'https://cn-timecheese.vercel.app/audio/Good%20Night%20-%20Lofi%20Cozy%20Chill%20Music.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
];
