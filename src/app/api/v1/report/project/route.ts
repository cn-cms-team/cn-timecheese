import { getReportProjectByUser } from '@/lib/report-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id') || '';
  const memberId = searchParams.get('member_id') || '';
  try {
    if (!memberId || !projectId) {
      return Response.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const result = await getReportProjectByUser(projectId, memberId);

    return Response.json({ data: result, status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
