import type { TimelineCardTone, TimelineItem } from '@/types/timesheet';

export const DAY_LABELS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

export const HOURS_BY_DAY_ID: Record<string, number> = {
  '2026-03-03': 6,
  '2026-03-04': 7.5,
  '2026-03-05': 8,
  '2026-03-06': 7,
  '2026-03-10': 7.5,
  '2026-03-11': 8,
  '2026-03-12': 6.5,
  '2026-03-13': 7,
  '2026-03-17': 8,
  '2026-03-18': 8,
  '2026-03-19': 7,
  '2026-03-20': 6,
  '2026-03-24': 8,
  '2026-03-25': 7.5,
  '2026-03-26': 8,
  '2026-03-27': 6.5,
  '2026-03-31': 9,
};

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'tl-1',
    dayId: '2026-03-10',
    startTime: '09:00',
    endTime: '10:30',
    durationLabel: '1.5 ชม.',
    title: 'ประชุมทีมประจำสัปดาห์',
    description:
      'อัปเดตสถานะงานของแต่ละทีมย่อย สรุปงานที่ติดบล็อก และวางแผนลำดับความสำคัญของงานในสปรินต์ถัดไปร่วมกับทีม UX และทีม Backend',
    category: 'Internal',
    tone: 'blue',
  },
  {
    id: 'tl-2',
    dayId: '2026-03-10',
    startTime: '10:30',
    endTime: '12:00',
    durationLabel: '1.5 ชม.',
    title: 'ออกแบบหน้า UI ใหม่',
    description:
      'ปรับโครงร่างหน้าจอ timesheet ให้รองรับการใช้งานบนมือถือและ desktop โดยเน้นลำดับข้อมูลที่อ่านง่าย เพิ่มสถานะรายวัน และออกแบบคอมโพเนนต์การ์ดกิจกรรมให้ขยายตามเนื้อหาได้',
    category: 'Design System',
    tone: 'violet',
  },
  {
    id: 'tl-3',
    dayId: '2026-03-10',
    startTime: '12:00',
    endTime: '13:00',
    durationLabel: '1 ชม.',
    title: 'พักเที่ยง',
    description: 'พักรับประทานอาหารและเตรียมงานสำหรับช่วงบ่าย',
    category: 'Personal',
    tone: 'slate',
  },
  {
    id: 'tl-4',
    dayId: '2026-03-10',
    startTime: '13:00',
    endTime: '16:30',
    durationLabel: '3.5 ชม.',
    title: 'เขียนโค้ด React Component',
    description:
      'พัฒนา timeline card component พร้อมสถานะสี, เพิ่มฟิลด์รายละเอียดกิจกรรม, ปรับปรุงการจัดวางในหน้าจอเล็ก และทดสอบการแสดงผลกรณีข้อความยาวหลายบรรทัดให้ไม่ถูกตัด',
    category: 'Frontend',
    tone: 'green',
  },
];

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
