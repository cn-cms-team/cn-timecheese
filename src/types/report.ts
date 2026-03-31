import { IPositionLevel } from '@/types/setting/position';
import { Feeling } from '@generated/prisma/enums';
export interface IDashboard extends IProjectReportBase {}
export interface IReportProject extends IProjectReportBase {}

export type IProjectFeelingSummary = Partial<Record<Feeling, number>>;

export interface IReportTeam {
  user: IReportUserInfo;
  projects: IProjectInfoByUser[];
}

export interface IReportProjectAttendance {
  date: string;
  series: IReportProjectAttendanceSeries[];
}

export interface IReportProjectAttendanceSeries {
  name: string;
  data: number;
}

export interface IReportProjectCompareTsItem {
  project_id: string;
  project_name: string;
  project_code: string;
  total_seconds: number;
  total_hours: number;
}

export interface IProjectReportBase {
  project_id: string;
  user: IReportUserInfo;
  project: IProjectInfoByUser;
  timeSheetChart: ITimeSheetDonutChart[];
  timeSheetTable: ITimeSheetTable[];
}

export interface IReportUserInfo {
  id: string;
  first_name: string;
  last_name: string;
  code: string;
  position_level: IPositionLevel;
  start_date: string;
  nick_name?: string;
}

export interface IProjectInfoByUser {
  id: string;
  name: string;
  code: string;
  start_date?: Date | null;
  end_date?: Date | null;
  maintenance_start_date?: Date | null;
  maintenance_end_date?: Date | null;
  position: string;
  day_price?: number | null;
  man_hours?: number;
  spent_times: number;
  spent_times_ma_period: number;
  feeling_summary?: IProjectFeelingSummary;
  last_tracked_at?: string | null;
}

export interface ITimeSheetDonutChart {
  task_type: string;
  tracked_hours: number;
}

export interface ITimeSheetData {
  data: ITimeSheetTable[];
  total_items: number;
}

export interface ITimeSheetTable {
  date: string;
  start_time: string;
  end_time: string;
  break_hours: number;
  tracked_hours: number;
  task_type: string;
  detail: string;
  remark: string | null;
  is_work_from_home: boolean;
  is_approved: boolean;
  feeling: Feeling;
}

export interface IReportProjectMonthly {
  project_name: string;
  project_code: string;
  month: number;
  year: number;
  members: IReportProjectMember[];
}

export interface IReportProjectMember {
  user_name: string;
  team_name: string;
  timeSheets: number;
}
