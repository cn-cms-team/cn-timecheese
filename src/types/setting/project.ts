import { ProjectStatus } from '../../../generated/prisma/client';

export type IProject = {
  id: string;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus;
};
