export interface ITimeSheetResponse {
  id: string;
  project_id: string;
  project_name: string;
  project_task_type_id: string;
  task_type_id: string;
  task_type_name: string;
  stamp_date: string;
  start_date: string;
  end_date: string;
  exclude_seconds: number;
  detail: string;
  remark: string;
  created_at: string;
}

export interface ITimeSheetRequest {
  id?: string;
  project_task_type_id: string | null;
  project_id: string;
  stamp_date: string;
  start_date: string;
  end_date: string;
  exclude_seconds: number | null;
  detail: string;
}

export interface IUserResponse {
  full_name: string;
  nick_name: string;
  position_level: string;
  team: string;
  start_date: string;
}

export interface ITimeSheetUserInfoResponse {
  user: IUserResponse;
  total_tracked_hr: number;
  total_trakced_overtimes: number;
  total_projects: number;
}

export type DayItem = {
  id: string;
  dayLabel: string;
  date: number;
  totalHours: number;
};

export type DayTimeSheetStatus = 'none' | 'under' | 'exact' | 'over';

export type TimelineCardTone = 'blue' | 'violet' | 'slate' | 'green' | 'red' | 'yellow' | 'orange';

export type TimelineItem = {
  id: string;
  dayId: DayItem['id'];
  startTime: string;
  endTime: string;
  durationLabel: string;
  title: string;
  description: string;
  category: string;
  tone: TimelineCardTone;
};

export type TimeSheetsRequest = {
  startDate: string;
  endDate: string;
};

export type TimeSheetsResponse = {
  hourData: Record<string, number>;
};
