import { TaskTypeCode } from '../../../generated/prisma/enums';

export type ITaskMenu = {
  id: TaskTypeCode;
  name: string;
  description?: string;
  is_project_task: boolean;
};
export type ITaskType = {
  id: string;
  type: TaskTypeCode;
  name: string;
  description?: string;
  is_active: boolean;
};
