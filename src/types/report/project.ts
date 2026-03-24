export type IReportProjectMember = {
  user_id: string;
  code: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  start_date: Date | null;
  position_level?: { name: string } | null;
  team_name: string;
};
