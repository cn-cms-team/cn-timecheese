export type ITeam = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
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
}

export interface TeamApiResponse {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
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
