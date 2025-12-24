import { ProjectStatus } from '@generated/prisma/client';
import { IOptions } from '../dropdown';

export type IProject = {
  id: string;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus;
};

export interface UserInfo extends IOptions {
  id: string;
  name: string;
  position: string;
  team_id: string;
}
