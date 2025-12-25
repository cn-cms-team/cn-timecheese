import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

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
    if (id === 'new') {
      return Response.json({
        data: { permissions: rolePermission },
        status: 200,
      });
    }

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
      children: rolePermission.children.map((child) => ({
        ...child,
        checked: child.modulePermission.filter((pms_code) =>
          checkedPermissions.some((b) => b.module_code === child.code && b.pms_code === pms_code)
        ),
      })),
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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const body = await request.json();
    const { name, description, permissions = [] } = body.data ?? {};

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) {
      return Response.json({ error: 'Role id is required' }, { status: 400 });
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        updated_by: session.user.id,
        updated_at: new Date(),
      },
    });

    await prisma.rolePermission.deleteMany({
      where: { role_id: role.id },
    });

    const rolePermissions = permissions.flatMap(
      (permission: { code: string; checked?: string[] }) =>
        (permission.checked ?? []).map((pmsCode) => ({
          role_id: role.id,
          module_code: permission.code,
          pms_code: pmsCode,
        }))
    );

    if (rolePermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: rolePermissions,
      });
    }

    return Response.json(
      {
        message: 'Update successfully',
        data: { id: role.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: 'Role ID is required' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({
        where: { role_id: id },
      }),
      prisma.role.delete({
        where: { id },
      }),
    ]);

    return Response.json(
      {
        message: 'Delete successfully',
        data: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
