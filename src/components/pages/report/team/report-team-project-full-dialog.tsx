import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TableListTimeSheet from '@/components/ui/custom/report/table-list-timesheet';

const ReportTeamProjectFullDialog = ({
  project_name,
  projectId,
  userId,
}: {
  project_name: string;
  projectId: string;
  userId: string;
}) => {
  return (
    <DialogContent
      showCloseButton
      className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] rounded-xl p-0 sm:max-w-[calc(100vw-2rem)]"
    >
      <DialogHeader className="sr-only">
        <DialogTitle>รายละเอียดโครงการ</DialogTitle>
      </DialogHeader>
      <div className="h-full w-full p-4">
        <div className="pb-2">
          <p className="font-semibold text-lg">{`โครงการ: ${project_name}`}</p>
        </div>
        <div>
          {projectId && userId ? (
            <TableListTimeSheet projectId={projectId} userId={userId} />
          ) : null}
        </div>
      </div>
    </DialogContent>
  );
};

export default ReportTeamProjectFullDialog;
