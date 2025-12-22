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
