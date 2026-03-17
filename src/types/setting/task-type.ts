import { TaskTypeCode } from '../../../generated/prisma/enums';
import { TimelineCardTone } from '../timesheet';

export type ITaskMenu = {
  id: TaskTypeCode;
  name: string;
  description?: string;
  is_project_task: boolean;
};
export type ITaskType = {
  id?: string;
  type: TaskTypeCode;
  name: string;
  description?: string;
  tone_color?: TimelineCardTone | null;
  is_active: boolean;
};

export type ITaskView = {
  id: TaskTypeCode;
  name: string;
  description?: string;
  is_project_task: boolean;
  task_type: ITaskType[];
};
