export type IPositionLevel = {
  id: string;
  name: string;
  description?: string;
  level: number;
};

export type IPosition = {
  id: string;
  name: string;
  description: string | null;

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
};
