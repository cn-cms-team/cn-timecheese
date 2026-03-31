import { TimeSheetCreateEditSchema } from '@/components/pages/timesheet/schema';
import type { TimelineCardTone } from '@/types/timesheet';
import { Feeling } from '@generated/prisma/enums';

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

export const START_TIME_HOUR = 9;
export const END_TIME_HOUR = 18;
export const DEFAULT_END_TIME_HOUR = 10;

export const FEELING_OPTIONS: Array<{
  value: NonNullable<TimeSheetCreateEditSchema['feeling']>;
  label: string;
  emoji: string;
  tooltip: string;
}> = [
  {
    value: Feeling.TERRIBLE,
    label: 'แย่มาก',
    emoji: '😩',
    tooltip: 'งานแย่/พัง: รู้สึกแย่กับผลงาน หรือเป็นงานที่ไม่อยากแตะเลย',
  },
  {
    value: Feeling.BAD,
    label: 'ไม่ค่อยดี',
    emoji: '🙁',
    tooltip: 'เหนื่อยใจ/ท้อ: งานมีปัญหาเยอะ ทำแล้วถอนหายใจ ไม่ค่อยโอเค',
  },
  {
    value: Feeling.NEUTRAL,
    label: 'เฉยๆ',
    emoji: '😐',
    tooltip: 'งั้นๆ/เรื่อยๆ: งานเสร็จตามหน้าที่ ไม่ได้รู้สึกตื่นเต้นหรือแย่อะไร',
  },
  {
    value: Feeling.GOOD,
    label: 'ดี',
    emoji: '🙂',
    tooltip: 'ดูดี/น่าพอใจ: งานออกมาสวยงาม ราบรื่น รู้สึกดีที่ได้ทำ',
  },
  {
    value: Feeling.GREAT,
    label: 'ดีมาก',
    emoji: '😄',
    tooltip: 'สุดยอด/ภูมิใจ: งานเทพมาก พลังมาเต็ม หรือเป็นงานระดับ Masterpiece',
  },
];
