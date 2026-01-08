export interface IDashboard extends IProjectReportBase {
  timesheet_monthly_column_chart: ITimeSheetMontlyColumnChart;
}
export interface IReportProject extends IProjectReportBase {}
export interface IReportTeam {
  user: IReportUserInfo;
  projects: IProjectInfoByUser[];
}

export interface IProjectReportBase {
  project_id: string;
  user: IReportUserInfo;
  project: IProjectInfoByUser;
  timesheet_chart: ITimeSheetDonutChart[];
  timesheet_table: ITimeSheetTable[];
}

export interface IReportUserInfo {
  id: string;
  full_name: string;
  position: string;
  code: string;
  start_date: string;
  saraly_range?: string;
  image: string;
}

export interface IProjectInfoByUser {
  name: string;
  code: string;
  start_date?: string;
  end_date?: string;
  position: string;
  day_price?: number;
  spent_times: number;
  last_tracked_at?: string;
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
}

export interface ITimeSheetMontlyColumnChart {}
