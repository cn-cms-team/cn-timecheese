import { PrismaClient } from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import bcrypt from 'bcrypt';

import permissionData from './data/permission.json';
import moduleData from './data/module.json';
import roleData from './data/role.json';
import positionData from './data/position.json';
import positionLevelData from './data/positionLevel.json';
import teamData from './data/team.json';
import { rolePermissionMember, rolePermissionAdmin, rolePermissionPM } from './data/rolePermission';
import { modulePermission } from './data/modulePermission';
import userData from './data/user.json';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  const ADMIN_ID = '9e6a2d0b-7f84-4c1e-b539-18a5f3c72d94';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const adminUser = await prisma.user.createMany({
    data: userData.map((user) => ({
      ...user,
      id: user.id === 'ADMIN_ID' ? ADMIN_ID : user.id,
      created_by: ADMIN_ID,
      password: hashedPassword,
    })),
  });
  console.log('Seeded admin user:', adminUser);

  const permissions = await prisma.permission.createMany({
    data: permissionData,
  });
  console.log('Seeded permissions:', permissions);

  const modules = await prisma.module.createMany({
    data: moduleData,
  });
  console.log('Seeded modules:', modules);

  const modulePermissions = await prisma.modulePermission.createMany({
    data: modulePermission,
  });
  console.log('Seeded module permissions:', modulePermissions);

  const position = await prisma.position.createMany({
    data: positionData.map((position) => ({
      ...position,
      created_by: ADMIN_ID,
    })),
  });
  console.log('Seeded positions:', position);

  const positionLevel = await prisma.positionLevel.createMany({
    data: positionLevelData,
  });
  console.log('Seeded position levels:', positionLevel);

  const roles = await prisma.role.createMany({
    data: roleData.map((role) => ({
      ...role,
      created_by: ADMIN_ID,
    })),
  });
  console.log('Seeded roles:', roles);

  const rolePermissionsMember = await prisma.rolePermission.createMany({
    data: rolePermissionMember,
  });
  console.log('Seeded role permissions for member:', rolePermissionsMember);

  const rolePermissionsAdmin = await prisma.rolePermission.createMany({
    data: rolePermissionAdmin,
  });
  console.log('Seeded role permissions for admin:', rolePermissionsAdmin);

  const rolePermissionsPM = await prisma.rolePermission.createMany({
    data: rolePermissionPM,
  });
  console.log('Seeded role permissions for PM:', rolePermissionsPM);

  const teams = await prisma.team.createMany({
    data: teamData.map((team) => ({
      ...team,
      created_by: ADMIN_ID,
    })),
  });
  console.log('Seeded teams:', teams);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
