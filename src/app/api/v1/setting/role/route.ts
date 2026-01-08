import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      where: { is_enabled: true },
      select: {
        id: true,
        name: true,
        description: true,
        updated_at: true,
        _count: {
          select: {
            User: true,
          },
        },
        updatedBy: { select: { id: true, first_name: true, last_name: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    const roleMaps = roles.map((role) => {
      const firstName = role.updatedBy?.first_name;
      const lastName = role.updatedBy?.last_name;
      return {
        id: role.id,
        code: role.id,
        name: role.name,
        description: role.description,
        isActive: true,
        updatedAt: role.updated_at,
        fullName:
          firstName && lastName
            ? [role.updatedBy?.first_name, role.updatedBy?.last_name].join(' ').trim()
            : null,
        userCount: role._count.User,
      };
    });
    return Response.json({ data: roleMaps, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const { name, description, permissions = [] } = body.data ?? {};

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await prisma.role.create({
      data: {
        name,
        description,
        created_by: session?.user?.id,
        created_at: new Date(),
      },
    });

    if (!result) {
      return Response.json({ error: 'Failed to create role' }, { status: 500 });
    }

    const rolePermissions = permissions.flatMap(
      (permission: { code: string; checked?: string[] }) =>
        (permission.checked ?? []).map((pmsCode) => ({
          role_id: result.id,
          module_code: permission.code,
          pms_code: pmsCode,
        }))
    );

    if (rolePermissions.length === 0) {
      return Response.json({ error: 'No permissions provided' }, { status: 404 });
    }

    const rolePermissionRes = await prisma.rolePermission.createMany({
      data: rolePermissions,
    });

    if (!rolePermissionRes) {
      return Response.json({ error: 'Failed to assign permissions' }, { status: 500 });
    }

    return Response.json(
      {
        message: 'Create success',
        data: { id: result.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
