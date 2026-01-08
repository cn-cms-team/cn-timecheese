import { IPositionLevel } from './position';

export type ITeam = {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
};
export interface TeamMember {
  id: string;
  name: string;
  isManager: boolean;
  team: string;
  teamId: string;
  position_level: IPositionLevel;
}

export interface TeamApiResponse {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  users: TeamMember[];
  teamLeaders?: TeamLeader[];
}

export interface TeamLeader {
  id: string;
  userId: string;
  teamId: string;
}

export interface SubmitRequest {
  id?: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}
