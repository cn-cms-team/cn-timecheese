import prisma from '@/lib/prisma';

type FlatMember = {
  user_id: string;
  code: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  team_name: string;
  start_date: Date | null;
  position_level?: { name: string } | null;
};

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id: projectId } = await params;

    if (!projectId) {
      return Response.json({ message: 'Project ID is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { is_company_project: true, is_enabled: true },
    });

    if (!project || !project.is_enabled) {
      return Response.json({ message: 'Project not found or disabled' }, { status: 404 });
    }

    const [companyMembers, customerMembers] = await Promise.all([
      project.is_company_project
        ? prisma.user.findMany({
            where: { is_enabled: true, is_active: true },
            select: {
              id: true,
              code: true,
              first_name: true,
              last_name: true,
              nick_name: true,
              start_date: true,
              team: { select: { name: true } },
              position_level: { select: { name: true } },
            },
            orderBy: { first_name: 'asc' },
          })
        : Promise.resolve([]),
      prisma.projectMember.findMany({
        where: { project_id: projectId, project: { is_enabled: true } },
        select: {
          user_id: true,
          role: true,
          user: {
            select: {
              code: true,
              first_name: true,
              last_name: true,
              nick_name: true,
              start_date: true,
              team: { select: { name: true } },
              position_level: { select: { name: true } },
            },
          },
        },
        orderBy: { user: { first_name: 'asc' } },
      }),
    ]);

    const normalized: FlatMember[] = [
      ...companyMembers.map((m) => ({
        user_id: m.id,
        code: m.code,
        first_name: m.first_name,
        last_name: m.last_name,
        nick_name: m.nick_name || '',
        start_date: m.start_date,
        position_level: m.position_level,
        team_name: m.team?.name || '',
      })),
      ...customerMembers.map((m) => ({
        user_id: m.user_id,
        code: m.user.code,
        first_name: m.user.first_name,
        last_name: m.user.last_name,
        nick_name: m.user.nick_name || '',
        start_date: m.user.start_date,
        position_level: m.role ? { name: m.role } : m.user.position_level,
        team_name: m.user.team?.name || '',
      })),
    ];

    // Deduplicate by user_id
    const unique = new Map<string, FlatMember>();
    for (const member of normalized) {
      unique.set(member.user_id, member);
    }

    return Response.json({ data: Array.from(unique.values()) }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
