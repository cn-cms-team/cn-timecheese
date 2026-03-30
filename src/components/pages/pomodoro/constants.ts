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
    id: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Wallpaper',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wallpaper.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Mining by Moonlight',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Mining%20by%20Moonlight.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Airport Lounge',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Airport%20Lounge.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    title: 'Evening Fall (Harp)',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening%20Fall%20-%20Harp.mp3',
    license: 'Incompetech Royalty-Free (with attribution)',
  },
  {
    id: '9b1c8e5c-2d3f-4a1e-9c6a-5f0e8b7a2c3d',
    title: 'Good Night - Lofi Cozy Chill Music',
    artist: 'FASSounds',
    url: 'https://cn-timecheese.vercel.app/audio/Good%20Night%20-%20Lofi%20Cozy%20Chill%20Music.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'f51a2e85-ef3d-4c3e-b7e5-1a86895c3709',
    title: 'Lo-fi Music Loop - Sentimental Jazzy Love',
    artist: 'Sonican',
    url: 'https://cn-timecheese.vercel.app/audio/sonican-lo-fi-music-loop-sentimental-jazzy-love-473154.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '1b9e5d4d-86cf-44b4-8dbb-f6a738ab71cf',
    title: 'Lofi Chill - Chill',
    artist: 'MondaMusic',
    url: 'https://cn-timecheese.vercel.app/audio/mondamusic-lofi-chill-chill-487317.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'a90bbcd8-2945-42a1-a64f-4d2c88bd03f9',
    title: 'Good Night - Lofi Cozy Chill Music',
    artist: 'FASSounds',
    url: 'https://cn-timecheese.vercel.app/audio/fassounds-good-night-lofi-cozy-chill-music-160166.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '4d1ac2c6-b33a-4db5-bee2-601e309cc48f',
    title: 'Lofi Chill 2',
    artist: 'DELOSound',
    url: 'https://cn-timecheese.vercel.app/audio/delosound-lofi-chill-2-466475.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '2e0394ba-e0f6-4a4b-8d16-6aa334cd9d26',
    title: 'Lofi Study - Calm Peaceful Chill Hop',
    artist: 'FASSounds',
    url: 'https://cn-timecheese.vercel.app/audio/fassounds-lofi-study-calm-peaceful-chill-hop-112191.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '51ce2d89-8d42-4f65-bcfe-e2c7a7b8e5a7',
    title: 'LoFi Background Music',
    artist: 'VibeHorn',
    url: 'https://cn-timecheese.vercel.app/audio/vibehorn-lofi-background-music-479217.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '8b525d80-5f21-419b-ac74-884abcb5af2c',
    title: 'Lofi Chill',
    artist: 'MondaMusic',
    url: 'https://cn-timecheese.vercel.app/audio/mondamusic-lofi-chill-491719.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '9d90d8ed-9df2-430b-9ca2-6b99beedbb37',
    title: 'Chill Lofi Beat',
    artist: 'VibeHorn',
    url: 'https://cn-timecheese.vercel.app/audio/vibehorn-chill-lofi-beat-469069.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '7de193c7-43ea-448f-8fb6-7aa03edbaf41',
    title: 'Lofi - Lofi Chill - Lofi Girl',
    artist: 'MondaMusic',
    url: 'https://cn-timecheese.vercel.app/audio/mondamusic-lofi-lofi-chill-lofi-girl-491690.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '6c40e1aa-f17e-4091-bfac-d6c2ef6a87cb',
    title: 'Lofi Urban Chill Music',
    artist: 'Aventure',
    url: 'https://cn-timecheese.vercel.app/audio/aventure-lofi-urban-chill-music-478919.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '281691a5-24bf-4dc8-a2af-828abdf81eaf',
    title: 'Lofi Chill',
    artist: 'DELOSound',
    url: 'https://cn-timecheese.vercel.app/audio/delosound-lofi-chill-483783.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'ef2aeabe-8086-444a-a21b-4b13bd7cf3a0',
    title: 'Lofi - Lofi Chill - Lofi Girl',
    artist: 'FreeMusicForVideo',
    url: 'https://cn-timecheese.vercel.app/audio/freemusicforvideo-lofi-lofi-chill-lofi-girl-504905.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '0d20d771-50e5-4f3b-b27e-8c650ee4f757',
    title: 'Lofi Chill',
    artist: 'MondaMusic',
    url: 'https://cn-timecheese.vercel.app/audio/mondamusic-lofi-chill-487321.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'ba7e7a78-4dfb-402a-a92c-fbceb002241e',
    title: 'Lofi Chill Background',
    artist: 'VibeHorn',
    url: 'https://cn-timecheese.vercel.app/audio/vibehorn-lofi-chill-background-461490.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'd0277bd6-1ed6-49a6-bfc1-912b704c77ea',
    title: 'Lofi Chill',
    artist: 'DELOSound',
    url: 'https://cn-timecheese.vercel.app/audio/delosound-lofi-chill-456258.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'c16acbaf-50b3-4f99-ab99-1bd1e9671d18',
    title: 'Lofi Dreamy Nostalgic Background',
    artist: 'Aventure',
    url: 'https://cn-timecheese.vercel.app/audio/aventure-lofi-dreamy-nostalgic-background-469629.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '97e1ed55-e7f0-4665-a864-1e0e8e606b98',
    title: 'lofi jazz music',
    artist: 'lofidreams',
    url: 'https://cn-timecheese.vercel.app/audio/lofidreams-lofi-jazz-music-485312.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'a972e391-7f99-4c02-a160-c3d3dd54d2de',
    title: 'Lofi Background Vibe',
    artist: 'AbsoluteSound',
    url: 'https://cn-timecheese.vercel.app/audio/absolutesound-lofi-background-vibe-505302.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: 'bb4fe1b5-85c1-4b15-bb8a-2115ec69dc52',
    title: 'Chill Lofi Background Music',
    artist: 'lNPLUSMUSIC',
    url: 'https://cn-timecheese.vercel.app/audio/lnplusmusic-chill-lofi-background-music-331434.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
  {
    id: '4fb58230-0504-44fe-a337-013fa89dcd67',
    title: 'Coffee Lofi - Lofi Music Chill Ambient',
    artist: 'Lofi_Music_Library',
    url: 'https://cn-timecheese.vercel.app/audio/lofi_music_library-coffee-lofi-lofi-music-chill-ambient-458900.mp3',
    license: 'https://pixabay.com/service/license-summary',
  },
];
