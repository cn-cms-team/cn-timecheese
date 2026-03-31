import { formatDate, secondsToDuration } from '@/lib/functions/date-format';
import { FEELING_OPTIONS } from '@/lib/constants/timesheet';
import { IProjectInfoByUser } from '@/types/report';
import { Skeleton } from '../../skeleton';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CardProjectInfoProps {
  project: IProjectInfoByUser;
  isLoading?: boolean;
  showProjectMember?: boolean;
}

const TimeTooltipBox = ({ allTime, MATime, isDisplayMATime }: any) => {
  return (
    <div className="text-2xl font-semibold">
      {isDisplayMATime ? (
        <>
          <Tooltip>
            <TooltipTrigger>
              <span>{MATime}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>เวลาที่ใช้ในช่วงบำรุงรักษา</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-sm text-gray-800 pl-1">/ {allTime}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>เวลาทั้งหมดที่ใช้ในโครงการ</p>
            </TooltipContent>
          </Tooltip>
        </>
      ) : (
        <span>{allTime}</span>
      )}
    </div>
  );
};

const CardProjectInfo = ({
  project,
  isLoading = false,
  showProjectMember = false,
}: CardProjectInfoProps) => {
  const [workDuration, setWorkDuration] = useState(secondsToDuration(project.spent_times || 0));
  const [workMAPeriodDuration, setWorkMAPeriodDuration] = useState(
    secondsToDuration(project.spent_times_ma_period || 0)
  );
  const estimatedDuration = secondsToDuration(project.man_hours ? project.man_hours * 3600 : 0);
  const estimatedDurationText =
    estimatedDuration.day === 0 && estimatedDuration.hour === 0
      ? 'ไม่กำหนด'
      : `${estimatedDuration.day === 0 ? '' : `${estimatedDuration.day} วัน `}${estimatedDuration.hour === 0 ? '' : `${estimatedDuration.hour} ชั่วโมง`}`;
  const feelingSummary = FEELING_OPTIONS.map((option) => ({
    ...option,
    count: project.feeling_summary?.[option.value] ?? 0,
  }));

  useEffect(() => {
    if (setWorkDuration) setWorkDuration(secondsToDuration(project.spent_times || 0));
    if (setWorkMAPeriodDuration)
      setWorkMAPeriodDuration(secondsToDuration(project.spent_times_ma_period || 0));
  }, [project]);
  return (
    <>
      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Skeleton className="col-span-3 h-47 w-full animate-pulse rounded-md bg-gray-200" />
            <Skeleton className="col-span-2 h-47 w-full animate-pulse rounded-md bg-gray-200" />
            <Skeleton className="col-span-1 md:col-span-5 h-32 w-full animate-pulse rounded-md bg-gray-200" />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
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
                  <label className="text-gray-500 mb-10">
                    {showProjectMember ? 'วันที่เข้าร่วม' : 'วันที่เริ่มโครงการ'}
                  </label>
                  <div className="mt-1">
                    {project.start_date ? formatDate(project.start_date, 'dd mmm yyyy') : '-'}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 mb-10">
                    {showProjectMember ? 'วันที่สิ้นสุด' : 'วันที่สิ้นสุดโครงการ'}
                  </label>
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
                <div>
                  <label className="text-gray-500 mb-10">เวลาที่ประเมินเข้าร่วมโครงการ</label>
                  <div className="mt-1">{estimatedDurationText}</div>
                </div>
              </div>
            </div>
            <div className="border rounded-lg col-span-1 md:col-span-2 p-3 flex flex-col h-full shadow">
              <div className="text-base font-semibold mb-4">เวลาทั้งหมดที่ใช้ในโครงการ</div>
              <div className="grid grid-cols-6 gap-4 flex-1">
                <div className="col-span-6 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <TimeTooltipBox
                      allTime={workDuration.day}
                      MATime={workMAPeriodDuration.day}
                      isDisplayMATime={project.spent_times_ma_period > 0}
                    />
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
                    <TimeTooltipBox
                      allTime={workDuration.hour}
                      MATime={workMAPeriodDuration.hour}
                      isDisplayMATime={project.spent_times_ma_period > 0}
                    />
                    <div className="ms-2">ชั่วโมง</div>
                  </div>
                </div>
                <div className="col-span-3 border rounded-lg px-3 py-1 flex items-center justify-center text-center">
                  <div className="flex items-baseline">
                    <TimeTooltipBox
                      allTime={workDuration.minute}
                      MATime={workMAPeriodDuration.minute}
                      isDisplayMATime={project.spent_times_ma_period > 0}
                    />
                    <div className="ms-2">นาที</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-lg shadow w-full p-3">
            <div className="text-base font-semibold mb-4">ความรู้สึกที่มีต่องาน</div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {feelingSummary.map((feeling) => (
                <Tooltip key={feeling.value}>
                  <TooltipTrigger asChild>
                    <div className="border rounded-lg px-3 py-4 text-center cursor-default bg-white">
                      <div className="text-3xl leading-none">{feeling.emoji}</div>
                      <div className="mt-1 text-2xl font-semibold">
                        {feeling.count === 0 ? '-' : feeling.count}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{feeling.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CardProjectInfo;
