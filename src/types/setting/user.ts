import { IPositionLevel } from './position';
import { IRole } from './role';
import { ITeam } from './team';

export type IUser = {
  id: string;
  code: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  nick_name?: string;
  start_date?: Date;
  end_date?: Date;
  lastLoginAt?: Date;

  position_level_id: string;
  position_level: IPositionLevel;
  team_id: string;
  team: ITeam;
  role_id: string;
  role: IRole;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  createdByUser: IUser;
  updatedByUser?: IUser;

  is_active: boolean;
  is_enabled: boolean;

  projectMembers: [];
  timeSheets: [];
};
