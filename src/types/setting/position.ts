export type IPositionLevel = {
  id: string;
  name: string;
  description?: string;
  ord: number;
  is_used?: boolean;
};

export type IPosition = {
  id: string;
  name: string;
  description: string | null;
  used_count: number;
  levels: IPositionLevel[];

  created_at: Date;
  updated_at?: Date;
  is_enabled: boolean;
};

export type IPositionRequest = {
  id: string;
  name: string;
  description: string | null;

  levels: IPositionLevelRequest[];

  created_at: Date;
  updated_at?: Date;
  is_enabled: boolean;
};

export type IPositionLevelRequest = {
  id: string;
  name: string;
  description?: string;
  ord: number;
  is_used?: boolean;
};
