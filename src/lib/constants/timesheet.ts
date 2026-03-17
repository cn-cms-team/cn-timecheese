import type { TimelineCardTone } from '@/types/timesheet';

export const DAY_LABELS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export const toneClasses: Record<TimelineCardTone, { panel: string; badge: string; text: string }> =
  {
    blue: {
      panel: 'border-blue-200/80 bg-blue-50/70',
      badge: 'bg-blue-100/80 text-blue-700',
      text: 'text-blue-700',
    },
    violet: {
      panel: 'border-violet-200/80 bg-violet-50/70',
      badge: 'bg-violet-100/80 text-violet-700',
      text: 'text-violet-700',
    },
    slate: {
      panel: 'border-slate-200/90 bg-slate-50/60',
      badge: 'bg-slate-100 text-slate-700',
      text: 'text-slate-700',
    },
    green: {
      panel: 'border-emerald-200/90 bg-emerald-50/70',
      badge: 'bg-emerald-100/80 text-emerald-700',
      text: 'text-emerald-700',
    },
    red: {
      panel: 'border-rose-200/80 bg-rose-50/70',
      badge: 'bg-rose-100/80 text-rose-700',
      text: 'text-rose-700',
    },
    yellow: {
      panel: 'border-yellow-200/80 bg-yellow-50/70',
      badge: 'bg-yellow-100/80 text-yellow-700',
      text: 'text-yellow-700',
    },
    orange: {
      panel: 'border-orange-200/80 bg-orange-50/70',
      badge: 'bg-orange-100/80 text-orange-700',
      text: 'text-orange-700',
    },
  };

export const TIMELINE_CARD_TONES = [
  'blue',
  'violet',
  'slate',
  'green',
  'red',
  'yellow',
  'orange',
] as const;
