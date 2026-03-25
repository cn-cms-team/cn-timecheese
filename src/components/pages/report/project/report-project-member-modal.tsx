'use client';

import AvatarDetail from '@/components/ui/custom/avatar/user-detail';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import TableListTimeSheet from '@/components/ui/custom/report/table-list-timesheet';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';
import { IDashboard, IReportTeam } from '@/types/report';
import { Skeleton } from '@/components/ui/skeleton';
import DonutChartTimeSheet from '@/components/ui/custom/report/donut-chart-timesheet';

type ReportProjectMemberModalProps = {
  projectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMemberInfo: IDashboard;
  isMemberInfoLoading: boolean;
};

const ReportProjectMemberModal = ({
  projectId,
  open,
  onOpenChange,
  selectedMemberInfo,
  isMemberInfoLoading,
}: ReportProjectMemberModalProps) => {
  const user = selectedMemberInfo?.user;
  const project = selectedMemberInfo?.project;
  const timeSheetChart = selectedMemberInfo?.timeSheetChart;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)]! h-[calc(100vh-2rem)] overflow-y-auto p-4"
      >
        <DialogTitle>ข้อมูลสมาชิกในโครงการ</DialogTitle>
        {user && project && projectId ? (
          <>
            <div className="border rounded-lg shadow">
              <AvatarDetail
                id={user?.id || ''}
                name={user ? `${user.first_name} ${user.last_name}` : ''}
                position={user?.position_level.name || ''}
                code={user?.code || ''}
                start_date={user?.start_date || ''}
                loading={isMemberInfoLoading}
              />
            </div>
            <CardProjectInfo project={project} isLoading={isMemberInfoLoading} />
            <DonutChartTimeSheet donutLabel={timeSheetChart} isLoading={isMemberInfoLoading} />
            <TableListTimeSheet projectId={projectId} userId={user.id} />
          </>
        ) : (
          <div className="space-y-4 py-2">
            <div className="border rounded-lg shadow p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-24 rounded-full" />
                <div className="space-y-2 w-full max-w-sm">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>

            <div className="border rounded-lg shadow p-4 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="border rounded-lg shadow p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`timesheet-skeleton-${index}`} className="h-10 w-full" />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportProjectMemberModal;
