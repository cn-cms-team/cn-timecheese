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
import { buddhistFormatDate, secondsToDuration } from '@/lib/functions/date-format';
import { IUserReportProject } from '@/types/report/team';
import { useMemo } from 'react';

const ReportTeamProject = ({
  name,
  code,
  start_date,
  end_date,
  position,
  join_date,
  spent_times,
}: IUserReportProject & { loading: boolean }) => {
  const spentTimeInSeconds = spent_times ?? 0;
  const workDuration = useMemo(() => secondsToDuration(spentTimeInSeconds), [spentTimeInSeconds]);
  const hasSpentTime = spentTimeInSeconds > 0;

  const durationText = [
    workDuration.year ? `${workDuration.year} ปี` : null,
    workDuration.month ? `${workDuration.month} เดือน` : null,
    workDuration.day ? `${workDuration.day} วัน` : null,
    workDuration.hour ? `${workDuration.hour} ชั่วโมง` : null,
    workDuration.minute ? `${workDuration.minute} นาที` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card className="relative flex h-full w-full max-w-full flex-col overflow-hidden border-0 bg-linear-to-br from-slate-50 via-white to-emerald-50 shadow-[0_14px_45px_-30px_rgba(15,23,42,0.65)]">
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-emerald-200/30 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-cyan-200/30 blur-2xl" />

      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            {/* <CardTitle className="text-base font-semibold text-slate-700">โครงการ</CardTitle> */}
            <CardDescription className="mt-1 text-lg font-medium text-slate-900">
              {name || '-'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative flex-1 space-y-3">
        <div className="rounded-xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
          <LabelGroup label="รหัสโครงการ" value={code || '-'} className="mb-0" />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
            <LabelGroup
              label="วันที่เข้าร่วม"
              value={start_date ? buddhistFormatDate(start_date, 'dd mmm yyyy') : '-'}
            />
          </div>
          <div className="rounded-xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
            <LabelGroup
              label="วันที่สิ้นสุด"
              value={end_date ? buddhistFormatDate(end_date, 'dd mmm yyyy') : '-'}
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
          <LabelGroup label="ตำแหน่งโครงการ" value={position || '-'} className="mb-0" />
        </div>
      </CardContent>

      <CardFooter className="relative mt-auto flex-col gap-3 border-t border-emerald-100/70 bg-white/60 pt-4">
        <div className="w-full rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 p-px">
          <div className="flex w-full flex-col items-center gap-2 rounded-[11px] bg-white/95 px-4 py-4">
            <Label className="text-sm font-medium text-slate-500">เวลาที่ใช้ในโครงการ</Label>
            <Label className="select-text break-all text-center text-2xl font-extrabold text-slate-900">
              {hasSpentTime ? durationText || '-' : '-'}
            </Label>
          </div>
        </div>

        <div className="w-full text-end text-xs text-slate-500">
          อัพเดตข้อมูลล่าสุด:{' '}
          {join_date ? buddhistFormatDate(join_date, 'dd mmm yy เวลา HH:ii') : '-'}
        </div>
      </CardFooter>
    </Card>
  );
};
export default ReportTeamProject;
