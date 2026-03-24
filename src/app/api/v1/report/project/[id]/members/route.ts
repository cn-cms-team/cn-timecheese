import prisma from '@/lib/prisma';

type MemberOption = { label: string; value: string };
type FlatMember = { user_id: string; first_name: string; last_name: string; nick_name: string };

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
            select: { id: true, first_name: true, last_name: true, nick_name: true },
            orderBy: { first_name: 'asc' },
          })
        : Promise.resolve([]),
      prisma.projectMember.findMany({
        where: { project_id: projectId, project: { is_enabled: true } },
        select: {
          user_id: true,
          user: { select: { first_name: true, last_name: true, nick_name: true } },
        },
        orderBy: { user: { first_name: 'asc' } },
      }),
    ]);

    const normalized: FlatMember[] = [
      ...companyMembers.map((m) => ({
        user_id: m.id,
        first_name: m.first_name,
        last_name: m.last_name,
        nick_name: m.nick_name || '',
      })),
      ...customerMembers.map((m) => ({
        user_id: m.user_id,
        first_name: m.user.first_name,
        last_name: m.user.last_name,
        nick_name: m.user.nick_name || '',
      })),
    ];

    // Deduplicate by user_id
    const unique = new Map<string, FlatMember>();
    for (const member of normalized) {
      unique.set(member.user_id, member);
    }

    const options: MemberOption[] = [...unique.values()]
      .sort((a, b) => a.first_name.localeCompare(b.first_name))
      .map((m) => ({
        label: `${m.first_name} ${m.last_name} ${m.nick_name ? `(${m.nick_name})` : ''}`.trim(),
        value: m.user_id,
      }));

    return Response.json({ data: options }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
