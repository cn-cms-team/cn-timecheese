import { auth } from '@/auth';
import { getReportUserInfo } from '@/lib/report-utils';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await getReportUserInfo(session.user.id);

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
