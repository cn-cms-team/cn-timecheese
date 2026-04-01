'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import DashboardBarChart from './dashboard-bar-chart';
import { Label } from '@/components/ui/label';
import { useDashboardContext } from './view/dashboard-use-context';
import AvatarDetail from '@/components/ui/custom/avatar/user-detail';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';
import TableListTimeSheet from '@/components/ui/custom/report/table-list-timesheet';
import DonutChartTimeSheet from '@/components/ui/custom/report/donut-chart-timesheet';
import { ComboboxForm } from '@/components/ui/custom/combobox';

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
          id={userInfo?.id || ''}
          name={userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : '-'}
          position={userInfo?.position_level?.name ?? '-'}
          code={userInfo?.code ?? '-'}
          start_date={userInfo?.start_date ?? '-'}
          nickname={userInfo?.nick_name ?? ''}
        />
      </div>
      <DashboardBarChart userId={userInfo?.id || ''} />
      <div className="space-y-1 max-w-sm">
        <Label>โครงการ</Label>
        <ComboboxForm
          value={projectId}
          isGroup={true}
          placeholder={loading ? 'กำลังโหลดโครงการ...' : 'เลือกโครงการ'}
          options={projectOption}
          onSelect={(value) => {
            setProjectId(value);
          }}
          disabled={loading}
        />
      </div>
      <CardProjectInfo
        project={dashboardProjectData?.project || {}}
        isLoading={loading}
        showProjectMember={true}
      />
      <DonutChartTimeSheet
        donutLabel={dashboardProjectData?.timeSheetChart || []}
        donutHeight={400}
      />
      {projectId && userInfo?.id ? (
        <TableListTimeSheet projectId={projectId} userId={userInfo?.id || ''} />
      ) : null}
    </div>
  );
};

export default DashboardContent;
