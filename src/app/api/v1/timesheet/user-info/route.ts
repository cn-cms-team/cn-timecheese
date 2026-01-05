import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user?.id },
      select: {
        first_name: true,
        last_name: true,
        nick_name: true,
        position_level: {
          select: { name: true },
        },
        team: { select: { name: true } },
        start_date: true,
      },
    });

    const [timeSummary, projectGroup, tasks] = await Promise.all([
      prisma.timeSheet.groupBy({
        by: ['user_id'],
        where: { user_id: session.user?.id },
        _sum: { total_seconds: true },
      }),

      prisma.timeSheet.groupBy({
        by: ['project_id'],
        where: { user_id: session.user?.id },
      }),

      prisma.timeSheet.findMany({
        where: { user_id: session.user.id },
        select: {
          start_date: true,
          end_date: true,
        },
      }),
    ]);

    let after6Seconds = 0;

    for (const task of tasks) {
      const start = new Date(task.start_date);
      const end = new Date(task.end_date);

      after6Seconds += calcAfter6PMSeconds(start, end);
    }

    const after6Hours = +(after6Seconds / 3600).toFixed(2);

    const totalSeconds = timeSummary[0]?._sum.total_seconds ?? 0;
    const totalTrackedHours = Number((totalSeconds / 3600).toFixed(2));
    const totalProjects = projectGroup.length;

    const result = {
      user: {
        full_name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim(),
        nick_name: userData?.nick_name || '',
        position_level: userData?.position_level?.name || '',
        team: userData?.team?.name || '',
        start_date: userData?.start_date ? userData.start_date.toISOString() : null,
      },
      total_tracked_hr: totalTrackedHours,
      total_trakced_overtimes: after6Hours,
      total_projects: totalProjects,
    };

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Failed to fetch user info' }, { status: 500 });
  }
}

function calcAfter6PMSeconds(start: Date, end: Date): number {
  const sixPM = new Date(start);
  sixPM.setHours(18, 0, 0, 0);

  const endOfDay = new Date(start);
  endOfDay.setHours(23, 59, 59, 999);

  if (end <= sixPM) return 0;

  const effectiveStart = start > sixPM ? start : sixPM;
  const effectiveEnd = end < endOfDay ? end : endOfDay;

  return Math.max(0, (effectiveEnd.getTime() - effectiveStart.getTime()) / 1000);
}
