import prisma from '@/lib/prisma';

async function getRolePermissions() {
  const [rolePermission, rolePermissionChild] = await Promise.all([
    prisma.module.findMany({
      where: { is_active: true, parent_code: null },
      select: {
        code: true,
        name: true,
        parent_code: true,
        order: true,
        modulePermission: {
          select: { pms_code: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.module.findMany({
      where: { is_active: true, parent_code: { not: null } },
      select: {
        code: true,
        name: true,
        parent_code: true,
        order: true,
        modulePermission: {
          select: { pms_code: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    }),
  ]);
  const rolePermissionChildMaps = rolePermissionChild.map((rolePermissionChild) => ({
    ...rolePermissionChild,
    modulePermission: rolePermissionChild.modulePermission.map((a) => a.pms_code),
    checked: [],
  }));

  const rolePermissionMaps = rolePermission.map((rolePermission) => ({
    ...rolePermission,
    modulePermission: rolePermission.modulePermission.map((a) => a.pms_code),
    checked: [],
    children: rolePermissionChildMaps.filter((child) => child.parent_code === rolePermission.code),
  }));
  return rolePermissionMaps;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const rolePermission = await getRolePermissions();
    // new role
    if (id === 'new') {
      return Response.json({
        data: { permissions: rolePermission },
        status: 200,
      });
    }

    // existing role
    const [checkedPermissions, role] = await Promise.all([
      prisma.rolePermission.findMany({
        where: { role_id: id },
        select: { module_code: true, pms_code: true },
      }),
      prisma.role.findUnique({
        where: { id, is_enabled: true },
        select: {
          id: true,
          name: true,
          description: true,
        },
      }),
    ]);

    if (!role) {
      return Response.json({ error: 'Role not found' }, { status: 404 });
    }

    const rolesPermissionMaps = rolePermission.map((rolePermission) => ({
      ...rolePermission,
      checked: rolePermission.modulePermission.filter((pms_code) =>
        checkedPermissions.some(
          (b) => b.module_code === rolePermission.code && b.pms_code === pms_code
        )
      ),
    }));
    const result = {
      ...role,
      permissions: rolesPermissionMaps,
    };

    return Response.json({ data: result, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
