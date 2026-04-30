export type IOkrOwner = {
  id: string;
  name: string;
  nick_name?: string | null;
  team_id?: string | null;
};

export type IOkrProgressMeta = {
  percent: number;
  total_target: number;
  total_progress: number;
};

export type IOkrKeyResult = {
  id?: string;
  title: string;
  start_date: string;
  end_date: string;
  target: number;
  progress: number;
  unit?: string | null;
  is_enabled?: boolean;
};

export type IOkrObjectiveListItem = {
  id: string;
  title: string;
  owner: IOkrOwner;
  key_results_count: number;
  start_date: string | null;
  end_date: string | null;
  progress: IOkrProgressMeta;
  is_owner: boolean;
  updated_at?: string | null;
  created_at: string;
};

export type IOkrObjectiveDetail = {
  id: string;
  title: string;
  owner: IOkrOwner;
  key_results: IOkrKeyResult[];
  progress: IOkrProgressMeta;
  is_owner: boolean;
  updated_at?: string | null;
  created_at: string;
};

export type IOkrKeyResultPayload = {
  id?: string;
  title: string;
  start_date: Date | string;
  end_date: Date | string;
  target: number;
  progress: number;
  unit?: string | null;
};

export type IOkrObjectivePayload = {
  title: string;
  keyResults: IOkrKeyResultPayload[];
};
