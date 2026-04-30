import { IOkrKeyResult, IOkrObjectiveDetail, IOkrObjectiveListItem, IOkrOwner } from '@/types/okr';

type OkrProgressInput = {
  target: number | null;
  progress: number | null;
};

type OkrKeyResultEntity = {
  id: string;
  title: string;
  start_date: Date;
  end_date: Date;
  target: number;
  progress: number;
  unit: string | null;
};

type OkrOwnerEntity = {
  id: string;
  first_name: string;
  last_name: string;
  nick_name: string | null;
  team_id: string | null;
};

type OkrObjectiveEntity = {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date | null;
  owner: OkrOwnerEntity;
  keyResults: OkrKeyResultEntity[];
};

export const getOkrOwnerDisplay = (owner: OkrOwnerEntity): IOkrOwner => ({
  id: owner.id,
  name: `${owner.first_name} ${owner.last_name}`.trim(),
  nick_name: owner.nick_name,
  team_id: owner.team_id,
});

export const getOkrProgressMeta = (keyResults: OkrProgressInput[]) => {
  const total_target = keyResults.reduce((sum, item) => sum + (item.target ?? 0), 0);
  const total_progress = keyResults.reduce((sum, item) => sum + (item.progress ?? 0), 0);

  return {
    total_target,
    total_progress,
    percent: total_target > 0 ? Number(((total_progress / total_target) * 100).toFixed(2)) : 0,
  };
};

export const mapOkrKeyResults = (keyResults: OkrKeyResultEntity[]): IOkrKeyResult[] =>
  keyResults.map((item) => ({
    id: item.id,
    title: item.title,
    start_date: item.start_date.toISOString(),
    end_date: item.end_date.toISOString(),
    target: item.target,
    progress: item.progress,
    unit: item.unit,
  }));

export const getOkrDateRange = (keyResults: OkrKeyResultEntity[]) => {
  if (!keyResults.length) {
    return {
      start_date: null,
      end_date: null,
    };
  }

  const timestamps = keyResults.flatMap((item) => [
    item.start_date.getTime(),
    item.end_date.getTime(),
  ]);

  return {
    start_date: new Date(Math.min(...timestamps)).toISOString(),
    end_date: new Date(Math.max(...timestamps)).toISOString(),
  };
};

export const mapOkrObjectiveListItem = (
  objective: OkrObjectiveEntity,
  currentUserId: string
): IOkrObjectiveListItem => {
  const dateRange = getOkrDateRange(objective.keyResults);

  return {
    id: objective.id,
    title: objective.title,
    owner: getOkrOwnerDisplay(objective.owner),
    key_results_count: objective.keyResults.length,
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    progress: getOkrProgressMeta(objective.keyResults),
    is_owner: objective.owner.id === currentUserId,
    created_at: objective.created_at.toISOString(),
    updated_at: objective.updated_at?.toISOString() ?? null,
  };
};

export const mapOkrObjectiveDetail = (
  objective: OkrObjectiveEntity,
  currentUserId: string
): IOkrObjectiveDetail => ({
  id: objective.id,
  title: objective.title,
  owner: getOkrOwnerDisplay(objective.owner),
  key_results: mapOkrKeyResults(objective.keyResults),
  progress: getOkrProgressMeta(objective.keyResults),
  is_owner: objective.owner.id === currentUserId,
  created_at: objective.created_at.toISOString(),
  updated_at: objective.updated_at?.toISOString() ?? null,
});
