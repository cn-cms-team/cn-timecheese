import { IconProps } from './ui';

export type IMenuId =
  | 'DASHBOARD'
  | 'TIME_SHEET'
  | 'REPORT'
  | 'REPORT_PROJECT_STATUS'
  | 'REPORT_TEAM_STATUS'
  | 'ADMIN'
  | 'ADMIN_USER'
  | 'ADMIN_ROLE'
  | 'ADMIN_PROJECT'
  | 'ADMIN_TASK_TYPE'
  | 'ADMIN_TEAM'
  | 'ADMIN_POSITION'
  | 'ADMIN_ACTIVITY_LOG';

export type IMenu = {
  menuId?: IMenuId;
  name: string;
  url: string;
  icon?: React.FC<IconProps>;
  items?: IMenu[];
};
