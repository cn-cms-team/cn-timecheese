'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import DashboardBarChart from './dashboard-bar-chart';
import { Label } from '@/components/ui/label';
import Dropdown from '@/components/ui/custom/input/dropdown';
import { useDashboardContext } from './view/dashboard-use-context';
import AvatarDetail from '@/components/ui/custom/avatar/user-detail';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';
import TableListTimesheet from '@/components/ui/custom/report/table-list-timesheet';
import DonutChartTimesheet from '@/components/ui/custom/report/donut-chart-timesheet';

const DashboardContent = () => {
  const { data: session } = useSession();
  const {
    userInfo,
    dashboardProjectData,
    projectOption,
    projectId,
    loading,
    setProjectId,
    fetchUserInfo,
    fetchProjectData,
    fetchProjectsOption,
  } = useDashboardContext();

  useEffect(() => {
    if (!session?.user?.id) return;

    const init = async () => {
      const userId = session?.user?.id;
      if (!userId) return;

      await Promise.allSettled([fetchUserInfo(userId), fetchProjectsOption()]);

      if (projectId) {
        await fetchProjectData(userId, projectId);
      }
    };

    init();
  }, [session?.user?.id, projectId]);

  return (
    <div className="w-full gap-4 flex flex-col">
      <div className="border rounded-lg shadow">
        <AvatarDetail
          name={userInfo?.user ? `${userInfo.user.first_name} ${userInfo.user.last_name}` : '-'}
          position={userInfo?.user?.position_level?.name ?? '-'}
          code={userInfo?.user?.code ?? '-'}
          start_date={userInfo?.user?.start_date ?? '-'}
        />
      </div>
      <DashboardBarChart />
      <div className="space-y-1 max-w-sm">
        <Label>โครงการ</Label>
        <Dropdown
          value={projectId}
          options={projectOption}
          isAllPlaceHolder={false}
          placeholder="เลือกโครงการ"
          onChange={(value) => setProjectId(value)}
        />
      </div>
      <CardProjectInfo project={dashboardProjectData?.project || {}} loading={loading} />
      <DonutChartTimesheet
        donutLabel={dashboardProjectData?.timesheet_chart || []}
        donutHeight={350}
      />
      <TableListTimesheet projectId={projectId} />
    </div>
  );
};

export default DashboardContent;
