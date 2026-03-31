import { TimelineCardTone } from '@/types/timesheet';
import { Feeling } from '@generated/prisma/enums';

export type IApprovalPendingMember = {
  user_id: string;
  code: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  position_name: string;
  team_name: string;
};

export type IApprovalPendingTimeSheet = {
  id: string;
  stamp_date: string;
  start_date: string;
  end_date: string;
  exclude_seconds: number;
  total_seconds: number;
  detail: string;
  remark: string;
  is_work_from_home: boolean;
  feeling: Feeling;
  task_type_name: string;
  tone_color: TimelineCardTone;
};

export type IApprovalPendingSummary = {
  user_id: string;
  project_id: string;
  sum_date: string;
  total_seconds: number;
  stamp_at: string;
  created_at: string;
  user: IApprovalPendingMember;
  time_sheets: IApprovalPendingTimeSheet[];
};

export type IApprovalPendingResponse = {
  members: IApprovalPendingMember[];
  summaries: IApprovalPendingSummary[];
};

export type IApprovalActionPayload = {
  user_id: string;
  project_id: string;
  sum_date: string;
};
