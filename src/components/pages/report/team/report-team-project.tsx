import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LabelGroup } from '@/components/ui/custom/form';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/functions/date-format';
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
}: IUserReportProject & { loading: boolean }) => {
  return (
    <Card className="w-full justify-between max-w-full">
      <CardHeader>
        <CardTitle>โครงการ</CardTitle>
        <CardDescription className="font-medium text-black">{name || '-'}</CardDescription>
      </CardHeader>
      <CardContent>
        <LabelGroup label="รหัสโครงการ" value={code || '-'} className="mb-3" />
        <div className="flex mb-3">
          <LabelGroup label="วันที่เข้าร่วม" value={start_date ? formatDate(start_date) : '-'} />
          <LabelGroup label="วันที่สิ้นสุด" value={end_date ? formatDate(end_date) : '-'} />
        </div>
        <LabelGroup label="ตำแหน่งโครงการ" value={position || '-'} />
      </CardContent>
      <CardFooter className="flex-col gap-2 border-t">
        <div className="flex justify-between w-full mb-2">
          <div className="flex flex-col w-full gap-3 items-center">
            <Label className="text-label text-sm text-[#999999]">จำนวนวัน</Label>
            <Label className="select-text break-all flex-wrap text-base font-bold">
              {numberWithCommas(value) || '-'}
            </Label>
          </div>
          <div className="flex flex-col w-full gap-3 items-center">
            <Label className="text-label text-sm text-[#999999]">ค่าใช้จ่าย</Label>
            <Label className="select-text break-all flex-wrap text-base font-bold">
              {numberWithCommas(value) || '-'}
            </Label>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-end w-full">
          วันที่เข้าร่วมล่าสุด: {join_date ? formatDate(join_date) : '-'}
        </div>
      </CardFooter>
    </Card>
  );
};
export default ReportTeamProject;
