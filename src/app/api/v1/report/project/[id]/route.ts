import { getProjectInfo } from '@/lib/report-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { id: projectId } = await params;

  if (!projectId) {
    return Response.json({ message: 'Project ID parameter is required' }, { status: 400 });
  }
  try {
    const projectInfo = await getProjectInfo(projectId);
    return Response.json({ data: projectInfo }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
