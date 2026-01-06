import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const user_id = searchParams.get('user_id');
    const currentUser = await prisma.user.findUnique({
      where: { id: user_id || '' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        code: true,
        position_level: {
          select: {
            id: true,
            name: true,
          },
        },
        start_date: true,
        salary_range: true,
        // image: true,
      },
    });
    if (!currentUser) {
      return Response.json({ error: 'User not found' }, { status: 400 });
    }

    const userProjects = await prisma.project.findMany({
      where: {
        projectMembers: {
          some: { user_id: currentUser.id },
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
        start_date: true,
        end_date: true,
        value: true,
        projectMembers: {
          where: { user_id: currentUser.id },
          select: {
            role: true,
            start_date: true,
          },
        },
      },
    });

    const projects = userProjects?.map((project) => {
      {
        const memberInfo = project.projectMembers[0];
        return {
          name: project.name,
          code: project.code,
          start_date: project.start_date,
          end_date: project.end_date,
          value: project.value,
          position: memberInfo?.role || '-',
          join_date: memberInfo?.start_date || '-',
        };
      }
    });
    const data = {
      user: currentUser,
      projects: projects,
    };

    return Response.json({ data: data, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
