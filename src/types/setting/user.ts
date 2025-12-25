import { ICategoryOption } from '@/components/ui/custom/input/category-dropdown';
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
  salary_range?: string;
  position_level_id: string;
  position_level: IPositionLevel;
  team_id: string;
  team: ITeam;
  role_id: string;
  role: IRole;

  created_at: Date;
  created_by: string;
  updated_at?: Date;
  updated_by?: string;
  createdByUser: IUser;
  updatedByUser?: IUser;

  is_active: boolean;
  is_enabled: boolean;

  projectMembers: [];
  timeSheets: [];
};

export interface IUserOption extends ICategoryOption {
  position?: string;
}
