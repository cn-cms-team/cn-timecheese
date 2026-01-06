import { IPositionLevel } from '../setting/position';

export type IReportTeam = {
  user: IUserReport;
  projects: IUserReportProject[];
};

export type IUserReport = {
  id: string;
  first_name: string;
  last_name: string;
  code: string;
  position_level: IPositionLevel;
  start_date: string;
  salary_range?: string;
  image?: string;
};

export type IUserReportProject = {
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  value: number;
  position: string;
  join_date: string;
};
