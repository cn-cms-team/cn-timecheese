export type ITeam = {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
};
