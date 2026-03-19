import { getReportProjectByUser, getReportUserInfo } from '@/lib/report-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id') || '';
  const memberId = searchParams.get('member_id') || '';
  try {
    if (!memberId || !projectId) {
      return Response.json({ message: 'Member ID is required' }, { status: 400 });
    }

    const userInfo = await getReportUserInfo(memberId);

    if (!userInfo) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    const project = await getReportProjectByUser(projectId, memberId);

    return Response.json({ data: { user: userInfo, ...project } }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
