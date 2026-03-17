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
        used_count: role._count.User,
      };
    });
    return Response.json({ data: roleMaps }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
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
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (permissions.length === 0) {
      return Response.json({ message: 'Permissions are required' }, { status: 400 });
    }

    const result = await prisma.role.create({
      data: {
        name,
        description,
        created_by: session?.user?.id,
        created_at: new Date(),
      },
    });

    const rolePermissions = permissions.flatMap(
      (permission: { code: string; checked?: string[] }) =>
        (permission.checked ?? []).map((pmsCode) => ({
          role_id: result.id,
          module_code: permission.code,
          pms_code: pmsCode,
        }))
    );

    await prisma.rolePermission.createMany({
      data: rolePermissions,
    });

    return Response.json(
      {
        message: 'Created successfully',
        data: { id: result.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
