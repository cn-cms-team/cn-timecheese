export type IRole = {
  id: string;
  code: string;
  name: string;
  description?: string;
  fullName: string;
  updatedAt?: Date;

  isActive: boolean;
  rolePermissions: IRolePermissions[];
};

export type IRolePermissions = {
  code: string;
  name: string;
  parent_code: string | null;
  order: number;
  modulePermission: string[];
  children?: IRolePermissions[];
  checked: string[];
};
