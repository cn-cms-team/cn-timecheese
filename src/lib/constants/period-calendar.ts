import { formatDate } from '../functions/date-format';

export enum PERIODCALENDAR {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export enum DAYTASKSTATUS {
  IGNORE = 'IGNORE',
  NOTASK = 'NO_TASK',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
}

export const DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const today = new Date();
export const weekAnchorDate = (month: number) => {
  return new Date(today.getFullYear(), month, today.getDate());
};

export const daysInMonth = (month: number) => {
  const year = weekAnchorDate(month).getFullYear();
  return new Date(year, month + 1, 0).getDate();
};

export const weekDays = (month: number) => {
  const year = weekAnchorDate(month).getFullYear();
  const days = daysInMonth(month);
  return Array.from({ length: days }, (_, i) => formatDate(new Date(year, month, i + 1), 'd'));
};

export const monthOption = Array.from({ length: 12 }, (_, i) => ({
  label: formatDate(new Date(today.getFullYear(), i, 1), 'mmmm'),
  value: i,
}));
