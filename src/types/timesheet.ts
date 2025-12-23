export interface ITimeSheetResponse {
  id: string;
  project_id: string;
  project_name: string;
  task_type_id: string;
  task_type_name: string;
  start_date: string;
  end_date: string;
  detail: string;
  remark: string;
  created_at: string;
}

export interface ITimeSheetRequest {
  project_id: string;
  task_type_id: string;
  start_date: string;
  end_date: string;
  detail: string;
  remark: string;
}
