import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { IMenuId } from '@/types/menu';
import { IPermissionId } from '@/types/permission';

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user?.id, is_active: true, is_enabled: true },
      select: {
        id: true,
        last_login_at: true,
        first_name: true,
        last_name: true,
        position_level: {
          select: {
            name: true,
          },
        },
        role: {
          select: {
            rolePermission: {
              select: {
                module_code: true,
                pms_code: true,
              },
            },
          },
        },
      },
    });

    const permissions: Record<IMenuId, IPermissionId[]> = {} as Record<IMenuId, IPermissionId[]>;
    if (user && user.role && user.role.rolePermission) {
      user.role.rolePermission.forEach(({ module_code, pms_code }) => {
        if (!permissions[module_code as IMenuId]) {
          permissions[module_code as IMenuId] = [];
        }
        permissions[module_code as IMenuId].push(pms_code as IPermissionId);
      });
    }

    return Response.json({
      data: {
        user_id: user ? user.id : null,
        permissions,
        last_login_at: user?.last_login_at || null,
        name: `${user?.first_name} ${user?.last_name}`,
        position_level: user?.position_level?.name,
      },
      status: 200,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
