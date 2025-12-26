import { ProjectStatus, TaskTypeCode } from '@generated/prisma/client';
import { IOptions } from '../dropdown';

export type IProject = {
  id: string;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus;
  value: number;
  description: string;
  people_cost: number;
  people_cost_percent: number;
  created_by: string;
  member: IProjectMember[];
  main_task_type: IProjectTaskType[];
  optional_task_type: IProjectTaskType[];
  updated_by: string;
};

export type IProjectMember = {
  team: string;
  name: string;
  project_id: string;
  user_id: string;
  role: string;
  day_price: number;
  start_date: string;
  end_date: string;
  work_hours: number;
  hour_price: number;
  is_using: boolean;
};

export type IProjectTaskType = {
  id: string;
  name: string;
  type: TaskTypeCode;
  project_id: string;
  task_type_id: string;
  description: string;
};

export interface UserInfo extends IOptions {
  id: string;
  name: string;
  position: string;
  team_id: string;
}

export interface TaskOptions extends IOptions {
  type: TaskTypeCode;
}
