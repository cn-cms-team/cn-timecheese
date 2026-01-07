import { getReportProjectByUser } from '@/lib/report-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id') || '';
  const memberId = searchParams.get('member_id') || '';
  try {
    if (!memberId) {
      return Response.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const result = await getReportProjectByUser(projectId, memberId);

    if (result instanceof Response) {
      return result;
    }

    const resultData = {
      project_id: projectId,
      user: {
        id: result.user.id,
        position: result.user.position || '',
        code: result.user.code,
        start_date: result.user.start_date,
        full_name: result.user.full_name,
      },
      project: result.project && {
        name: result.project.name,
        code: result.project.code,
        start_date: result.project.start_date,
        end_date: result.project.end_date,
        position: result.project.position,
        last_tracked_at: null,
      },
      timesheet_chart: result.timesheet_chart,
    };

    return Response.json({ data: resultData, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
