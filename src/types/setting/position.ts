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

  createdAt: Date;
  updatedAt?: Date;
  isEnabled: boolean;
};

export type IPositionRequest = {
  id: string;
  name: string;
  description: string | null;

  levels: IPositionLevelRequest[];

  createdAt: Date;
  updatedAt?: Date;
  isEnabled: boolean;
};

export type IPositionLevelRequest = {
  id: string;
  name: string;
  description?: string;
  ord: number;
};
