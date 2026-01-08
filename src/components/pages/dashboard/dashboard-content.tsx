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
  const { data } = useSession();
  const {
    dashboardProjectData,
    projectOption,
    projectId,
    loading,
    setProjectId,
    fetchProjectData,
    fetchProjectsOption,
  } = useDashboardContext();

  useEffect(() => {
    if (!data?.user?.id) return;

    const init = async () => {
      if (projectOption.length === 0) {
        await fetchProjectsOption();
      }

      if (projectId) {
        await fetchProjectData(data.user.id, projectId);
      }
    };

    init();
  }, [data?.user?.id, projectId]);

  return (
    <div className="w-full gap-4 flex flex-col">
      <div className="border rounded-lg">
        <AvatarDetail
          name={dashboardProjectData?.user?.full_name || '-'}
          position={dashboardProjectData?.user?.position || '-'}
          code={dashboardProjectData?.user?.code || '-'}
          start_date={dashboardProjectData?.user?.start_date || '-'}
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
        donutHeight={250}
      />
      <TableListTimesheet projectId={projectId} />
    </div>
  );
};

export default DashboardContent;
