export interface ITimeSheetResponse {
  id: string;
  project_id: string;
  project_name: string;
  task_type_id: string;
  task_type_name: string;
  stamp_date: string;
  start_date: string;
  end_date: string;
  detail: string;
  remark: string;
  created_at: string;
}

export interface ITimeSheetRequest {
  id?: string;
  project_id: string;
  task_type_id: string;
  stamp_date: string;
  start_date: string;
  end_date: string;
  detail: string;
  remark: string;
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
