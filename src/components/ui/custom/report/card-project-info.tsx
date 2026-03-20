import { calcTotalDays, formatDate, secondsToDuration } from '@/lib/functions/date-format';
import { numberWithCommas } from '@/lib/functions/number-format';
import { IProjectInfoByUser } from '@/types/report';
import { Skeleton } from '../../skeleton';
import { useEffect, useState } from 'react';

interface CardProjectInfoProps {
  project: IProjectInfoByUser;
  loading?: boolean;
}

const CardProjectInfo = ({ project, loading = false }: CardProjectInfoProps) => {
  const [workDuration, setWorkDuration] = useState(secondsToDuration(project.spent_times || 0));
  const workedDays = Math.floor((project.spent_times || 0) / 28800); // assuming 8 hours per day
  const totalDays =
    project.start_date && project.end_date
      ? calcTotalDays(project.start_date.toString(), project.end_date.toString())
      : 0;
  const totalCost = (project.day_price || 0) * (totalDays || 0);
  const usedCost = (project.day_price || 0) * workedDays;
  const costPercentage = totalCost ? ((usedCost / totalCost) * 100).toFixed(2) : '0.00';

  useEffect(() => {
    if (setWorkDuration) setWorkDuration(secondsToDuration(project.spent_times || 0));
  }, [project]);
  return (
    <>
      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Skeleton className="col-span-3 h-47 w-full animate-pulse rounded-md bg-gray-200" />
            <Skeleton className="col-span-2 h-47 w-full animate-pulse rounded-md bg-gray-200" />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="border rounded-lg col-span-3 shadow p-3">
              <div className="text-base font-semibold mb-4">ข้อมูลโครงการ</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 mb-10">โครงการ</label>
                  <div className="mt-1">{project.name}</div>
                </div>
                <div>
                  <label className="text-gray-500 mb-10">รหัสโครงการ</label>
                  <div className="mt-1">{project.code}</div>
                </div>
                <div>
                  <label className="text-gray-500 mb-10">วันที่เข้าร่วม</label>
                  <div className="mt-1">
                    {project.start_date ? formatDate(project.start_date, 'dd mmm yyyy') : '-'}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 mb-10">วันที่สิ้นสุด</label>
                  <div className="mt-1">
                    {project.end_date ? formatDate(project.end_date, 'dd mmm yyyy') : '-'}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 mb-10">ตำแหน่งในโครงการ</label>
                  <div className="mt-1">{project.position}</div>
                </div>
              </div>
            </div>
            <div className="border rounded-lg col-span-2 p-3 flex flex-col h-full shadow">
              <div className="text-base font-semibold mb-4">เวลาที่ใช้ในโครงการ</div>
              <div className="grid grid-cols-6 gap-4 flex-1">
                <div className="col-span-2 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{workDuration.year}</div>
                    <div className="ms-2">ปี</div>
                  </div>
                </div>
                <div className="col-span-2 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{workDuration.month}</div>
                    <div className="ms-2">เดือน</div>
                  </div>
                </div>
                <div className="col-span-2 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{workDuration.day}</div>
                    <div className="ms-2">วัน</div>
                  </div>
                </div>
                <div className="col-span-3 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{workDuration.hour}</div>
                    <div className="ms-2">ชั่วโมง</div>
                  </div>
                </div>
                <div className="col-span-3 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{workDuration.minute}</div>
                    <div className="ms-2">นาที</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CardProjectInfo;
