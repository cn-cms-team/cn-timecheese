import { getReportProjectByUser, getReportUserInfo } from '@/lib/report-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id') || '';
  const memberId = searchParams.get('member_id') || '';
  try {
    if (!memberId) {
      return Response.json({ message: 'Member ID is required' }, { status: 400 });
    }

    const userInfo = await getReportUserInfo(memberId);

    if (!userInfo) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    const project = await getReportProjectByUser(projectId, memberId);

    const resultData = {
      project_id: projectId,
      user: {
        id: userInfo.id,
        position: userInfo.position_level?.name || '',
        code: userInfo.code,
        start_date: userInfo.start_date,
        full_name: `${userInfo.first_name} ${userInfo.last_name}`,
      },
      project: project.project && {
        name: project.project.name,
        code: project.project.code,
        start_date: project.project.start_date,
        end_date: project.project.end_date,
        maintenance_start_date: project.project.maintenance_start_date,
        maintenance_end_date: project.project.maintenance_end_date,
        position: project.project.position,
        last_tracked_at: null,
        spent_times: project.project?.spent_times || 0,
        spent_times_ma_period: project.project?.spent_times_ma_period || 0,
      },
      timeSheetChart: project.timeSheetChart,
    };

    return Response.json({ data: resultData }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
