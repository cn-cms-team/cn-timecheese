import { AlertTriangle, ArrowUp, Check, Circle } from 'lucide-react';

import { DAY_LABELS, HOURS_BY_DAY_ID } from '@/lib/constants/timesheet';
import type { DayItem, DayTimeSheetStatus } from '@/types/timesheet';

export const getDayId = (year: number, month: number, date: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

export const parseDayId = (dayId: string) => {
  const [year, month, date] = dayId.split('-').map(Number);
  return new Date(year, month - 1, date);
};

export const getDaysForMonth = (year: number, monthIndex: number): DayItem[] =>
  Array.from({ length: new Date(year, monthIndex + 1, 0).getDate() }, (_, index) => {
    const date = index + 1;
    const id = getDayId(year, monthIndex + 1, date);

    return {
      id,
      dayLabel: DAY_LABELS[new Date(year, monthIndex, date).getDay()],
      date,
      totalHours: HOURS_BY_DAY_ID[id] ?? 0,
    };
  });

export const formatMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    month: 'long',
    year: 'numeric',
  }).format(date);

export const formatTotalHours = (hours: number) => {
  if (!hours) {
    return '0 ชั่วโมง';
  }

  return `${hours} ชั่วโมง`;
};

export const formatHourValue = (hours: number) => hours.toFixed(1);

export const getDayTimeSheetStatus = (hours: number): DayTimeSheetStatus => {
  if (!hours) {
    return 'none';
  }

  if (hours < 8) {
    return 'under';
  }

  if (hours === 8) {
    return 'exact';
  }

  return 'over';
};

export const getDayStatusBadge = (hours: number) => {
  const status = getDayTimeSheetStatus(hours);

  if (status === 'none') {
    return {
      icon: Circle,
      value: null,
      className: 'bg-slate-100 text-slate-500',
      activeClassName: 'bg-white/15 text-white',
      ariaLabel: 'ยังไม่มีการลงเวลา',
    };
  }

  if (status === 'under') {
    return {
      icon: AlertTriangle,
      value: `${formatHourValue(hours)}h`,
      className: 'bg-amber-100 text-amber-700',
      activeClassName: 'bg-amber-400/25 text-white',
      ariaLabel: `ลงเวลา ${hours} ชั่วโมง ยังไม่ครบ`,
    };
  }

  if (status === 'exact') {
    return {
      icon: Check,
      value: `${formatHourValue(hours)}h`,
      className: 'bg-emerald-100 text-emerald-700',
      activeClassName: 'bg-emerald-400/25 text-white',
      ariaLabel: 'ลงเวลาครบ 8 ชั่วโมง',
    };
  }

  return {
    icon: ArrowUp,
    value: `${formatHourValue(hours)}h`,
    className: 'bg-sky-100 text-sky-700',
    activeClassName: 'bg-sky-400/25 text-white',
    ariaLabel: `ลงเวลาเกิน 8 ชั่วโมง ${hours} ชั่วโมง`,
  };
};
