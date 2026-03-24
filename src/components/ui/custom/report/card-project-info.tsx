import { formatDate, secondsToDuration } from '@/lib/functions/date-format';
import { IProjectInfoByUser } from '@/types/report';
import { Skeleton } from '../../skeleton';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CardProjectInfoProps {
  project: IProjectInfoByUser;
  isLoading?: boolean;
}

const CardProjectInfo = ({ project, isLoading = false }: CardProjectInfoProps) => {
  const [workDuration, setWorkDuration] = useState(secondsToDuration(project.spent_times || 0));

  useEffect(() => {
    if (setWorkDuration) setWorkDuration(secondsToDuration(project.spent_times || 0));
  }, [project]);
  return (
    <>
      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Skeleton className="col-span-3 h-47 w-full animate-pulse rounded-md bg-gray-200" />
            <Skeleton className="col-span-2 h-47 w-full animate-pulse rounded-md bg-gray-200" />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="border rounded-lg col-span-1 md:col-span-3 shadow p-3">
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
                  <label className="text-gray-500 mb-10">วันที่เริ่มบำรุงรักษา</label>
                  <div className="mt-1">
                    {project.maintenance_start_date
                      ? formatDate(project.maintenance_start_date, 'dd mmm yyyy')
                      : '-'}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 mb-10">วันที่สิ้นสุดการบำรุงรักษา</label>
                  <div className="mt-1">
                    {project.maintenance_end_date
                      ? formatDate(project.maintenance_end_date, 'dd mmm yyyy')
                      : '-'}
                  </div>
                </div>
                {project.position ? (
                  <div>
                    <label className="text-gray-500 mb-10">ตำแหน่งในโครงการ</label>
                    <div className="mt-1">{project.position}</div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="border rounded-lg col-span-1 md:col-span-2 p-3 flex flex-col h-full shadow">
              <div className="text-base font-semibold mb-4">เวลาทั้งหมดที่ใช้ในโครงการ</div>
              <div className="grid grid-cols-6 gap-4 flex-1">
                <div className="col-span-6 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold">{workDuration.day}</div>
                    <div className="ms-2 flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger>วัน</TooltipTrigger>
                        <TooltipContent>
                          <p>1 ManDay = 8 ชั่วโมง</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
