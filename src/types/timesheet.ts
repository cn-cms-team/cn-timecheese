import { Feeling } from '@generated/prisma/enums';

export type DayItem = {
  id: string;
  dayLabel: string;
  date: number;
  totalHours: number;
  isHoliday: boolean;
  holidayName: string | null;
};

export type DayTimeSheetStatus = 'none' | 'under' | 'exact' | 'over';

export type TimelineCardTone = 'blue' | 'violet' | 'slate' | 'green' | 'red' | 'yellow' | 'orange';

export type TimelineItem = {
  id: string;
  stamp_date: DayItem['id'];
  start_date: string;
  end_date: string;
  total_seconds: number;
  exclude_seconds: number;
  project_id: string;
  project_task_type_id: string;
  project_name: string;
  detail: string;
  remark: string | null;
  feeling: Feeling;
  isWorkFromHome: boolean;
  is_approved: boolean;
  task_type_name: string | null;
  tone: TimelineCardTone;
};

export type TimeSheetsRequest = {
  startDate: string;
  endDate: string;
};

export type TimeSheetsResponse = {
  hourData: Record<string, number>;
  holidayDates: string[];
  holidayNamesByDate: Record<string, string>;
};
