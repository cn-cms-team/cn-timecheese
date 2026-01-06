import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LabelGroup } from '@/components/ui/custom/form';
import { calcTotalDays, formatDate } from '@/lib/functions/date-format';
import { numberWithCommas } from '@/lib/functions/number-format';
import { IUserReportProject } from '@/types/report/team';

const ReportTeamProject = ({
  name,
  code,
  start_date,
  end_date,
  value,
  position,
  join_date,
}: IUserReportProject) => {
  return (
    <Card className="w-full justify-between max-w-full lg:max-w-[350px]">
      <CardHeader>
        <CardTitle>โครงการ</CardTitle>
        <CardDescription>{name || '-'}</CardDescription>
      </CardHeader>
      <CardContent>
        <LabelGroup label="รหัสโครงการ" value={code || '-'} className="mb-3" />
        <div className="flex mb-3">
          <LabelGroup label="วันที่เข้าร่วม" value={start_date ? formatDate(start_date) : '-'} />
          <LabelGroup label="วันที่สิ้นสุด" value={end_date ? formatDate(end_date) : '-'} />
        </div>
        <LabelGroup label="ตำแหน้งโครงการ" value={position || '-'} />
      </CardContent>
      <CardFooter className="flex-col gap-2 border-t">
        <div className="flex justify-between w-full mb-2">
          <LabelGroup
            label="จำนวนวัน"
            value={start_date && end_date ? calcTotalDays(start_date, end_date) : '-'}
          />
          <LabelGroup label="ค่าใช้จ่าย" value={numberWithCommas(value)} />
        </div>
        <div className="text-xs text-gray-400 text-end w-full">
          วันที่เข้าร่วมล่าสุด: {join_date || '-'}
        </div>
      </CardFooter>
    </Card>
  );
};
export default ReportTeamProject;
