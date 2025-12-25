import { FilterPeriod } from '@/types/period';
import { differenceInBusinessDays, format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';

export function formatDateAndTime(dateString: string): string {
  if (!dateString) return '';
  const date = parseISO(dateString);
  const buddhistYear: number = date.getFullYear() + 543;
  const formatted: string = format(date, 'dd/MM/yyyy HH:mm', { locale: th });
  return formatted.replace(/(\d{2}\/\d{2}\/)\d{4}/, `$1${buddhistYear}`);
}

const monthNames = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const monthShortNames = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const dayOfWeekNames = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัสบดี',
  'วันศุกร์',
  'วันเสาร์',
];
const dayOfWeekShortNames = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

const twoDigitPad = (num: number) => (num < 10 ? '0' + num : String(num));

export const buddhistFormatDate = (
  dateString: string | Date | undefined,
  patternStr = 'yyyy-mm-dd'
) => {
  const isBuddhist = true;
  return formatDate(dateString, patternStr, isBuddhist);
};

export const formatDate = (
  dateString: string | Date | undefined,
  patternStr = 'yyyy-mm-dd',
  isBuddhist = false
) => {
  if (typeof dateString === 'undefined' || dateString === null) {
    return '';
  }

  if (dateString === '') {
    return '';
  }

  const date: Date = dateString instanceof Date ? dateString : new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = isBuddhist ? date.getFullYear() + 543 : date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const miliseconds = date.getMilliseconds();
  const h = hour % 12;
  const hh = twoDigitPad(h);
  const HH = twoDigitPad(hour);
  const ii = twoDigitPad(minute);
  const ss = twoDigitPad(second);
  const aaa = hour < 12 ? 'AM' : 'PM';
  const EEEE = dayOfWeekNames[date.getDay()];
  const EEE = dayOfWeekShortNames[date.getDay()];
  const dd = twoDigitPad(day);
  const m = month + 1;
  const mm = twoDigitPad(m);
  const mmmm = monthNames[month];
  const mmm = monthShortNames[month];
  const yyyy = year + '';
  const yy = yyyy.substring(yyyy.length - 2);

  patternStr = patternStr
    .replace(/hh/g, `${hh}`)
    .replace(/h/g, `${h}`)
    .replace(/HH/g, `${HH}`)
    .replace(/H/g, `${hour}`)
    .replace(/ii/g, `${ii}`)
    .replace(/i/g, `${minute}`)
    .replace(/ss/g, `${ss}`)
    .replace(/s/g, `${second}`)
    .replace(/S/g, `${miliseconds}`)
    .replace(/dd/g, `${dd}`)
    .replace(/d/g, `${day}`)
    .replace(/EEEE/g, `${EEEE}`)
    .replace(/EEE/g, `${EEE}`)
    .replace(/yyyy/g, `${yyyy}`)
    .replace(/yy/g, `${yy}`)
    .replace(/aaa/g, `${aaa}`);
  if (patternStr.includes('mmm')) {
    patternStr = patternStr.replace(/mmmm/g, `${mmmm}`).replace(/mmm/g, `${mmm}`);
  } else {
    patternStr = patternStr.replace(/mm/g, `${mm}`).replace(/m/g, `${m}`);
  }

  return patternStr;
};

// convert seconds to HH:mm:ss format
export const formatSecondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let hoursFormatted: string;
  if (hours < 10) {
    hoursFormatted = twoDigitPad(hours);
  } else {
    hoursFormatted = hours.toLocaleString();
  }

  const minutesFormatted = twoDigitPad(minutes);
  const secondsFormatted = twoDigitPad(secs);

  return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
};

export function formatTimeDifference(createdAt: Date) {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - createdAt?.getTime();

  const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return `${diffInSeconds} วินาที`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} นาที`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ชั่วโมง`;
  } else {
    return `${diffInDays} วัน`;
  }
}
export function formatTime(dateString: string | Date | undefined) {
  if (typeof dateString === 'undefined' || dateString === null) {
    return '';
  }

  if (dateString === '') {
    return '';
  }

  const date: Date = dateString instanceof Date ? dateString : new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date(dateString);
  const formattedTime24Hour = format(now, 'HH:mm');
  return `${formattedTime24Hour} น.`;
}

// convert date range to budget year
export const convertDateRangeToBudgetYear = (range: {
  from: Date;
  to: Date;
}): { from: Date; to: Date } => {
  const fromDate = new Date(range.from);
  fromDate.setFullYear(fromDate.getFullYear() - 1, 9, 1);

  const toDate = new Date(range.to ?? range.from);
  toDate.setFullYear(toDate.getFullYear(), 8, 30);

  return { from: fromDate, to: toDate };
};

// get default value of period report
export const defaultPeriodReportValue = (type: FilterPeriod) => {
  const today = new Date();
  let from: Date;
  let to: Date = new Date(today);

  switch (type) {
    case FilterPeriod.DAILY: {
      from = new Date(today);
      from.setDate(from.getDate() - 30);
      break;
    }
    case FilterPeriod.MONTHLY: {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    }
    case FilterPeriod.YEARLY: {
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      if (currentMonth >= 9) {
        from = new Date(currentYear + 1, 9, 1);
      } else {
        from = new Date(currentYear, 9, 1);
      }

      to = null!;
      break;
    }
    default:
      throw new Error(`Unknown filter period: ${type}`);
  }

  return { from, to };
};

export function daysUntilExpireMinus30(expireDate: Date) {
  const expire = new Date(expireDate);
  const targetDate = new Date(expire);
  targetDate.setDate(targetDate.getDate() + 30); // บวก 30 วัน

  const today = new Date();
  today.setHours(0, 0, 0, 0); // ตัดเวลาออก เหลือแต่วันที่
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime(); // ผลต่างเป็นมิลลิวินาที
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

// convert time for ambulance officer work shift
export function convertTimeOfWorkShift(
  work_date_time: string,
  patternStr = 'HH:ii',
  isStart: boolean
) {
  if (!work_date_time) return '';

  const date = new Date(work_date_time);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const seconds = date.getSeconds();

  if (hours === 0 && minutes === 0) {
    if (isStart) {
      minutes = 1;
    } else {
      hours = 24;
    }
  }

  const HH = twoDigitPad(hours);
  const ii = twoDigitPad(minutes);
  const ss = twoDigitPad(seconds);

  return patternStr.replace(/HH/g, HH).replace(/ii/g, ii).replace(/ss/g, ss);
}

export const calAge = (birthdate: string | Date): number => {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const getMinYear = (): Date => {
  const minYear = Number(process.env.NEXT_PUBLIC_MIN_YEAR_INPUT) || 2025;
  return new Date(minYear, 0, 1);
};

export const getFiscalYear = (used_date: string) => {
  const date = new Date(used_date);
  const month = date.getMonth();
  const fiscalYear = month >= 9 ? date.getFullYear() + 1 : date.getFullYear();
  return fiscalYear;
};

export function secondsToFormatUnit(sec: number) {
  if (sec == null || isNaN(sec)) return '-';

  const totalSeconds = Math.floor(sec);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} ชั่วโมง ${minutes} นาที`;
  } else if (minutes > 0) {
    return `${minutes} นาที ${seconds} วินาที`;
  } else {
    return `${seconds} วินาที`;
  }
}

export function calcTotalDays(start?: string, end?: string): number | null {
  if (!start || !end) return null;

  const diff = differenceInBusinessDays(end, start);
  return diff >= 0 ? diff + 1 : null;
}
