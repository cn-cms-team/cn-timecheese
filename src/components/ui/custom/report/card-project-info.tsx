import { calcTotalDays, formatDate, secondsToDuration } from '@/lib/functions/date-format';
import { numberWithCommas } from '@/lib/functions/number-format';
import { IProjectInfoByUser } from '@/types/report';

interface CardProjectInfoProps {
  project: IProjectInfoByUser;
}

const CardProjectInfo = ({ project }: CardProjectInfoProps) => {
  const workDuration = secondsToDuration(project.spent_times || 0);
  const workedDays = Math.floor((project.spent_times || 0) / 28800); // assuming 8 hours per day
  const totalDays =
    project.start_date && project.end_date
      ? calcTotalDays(project.start_date.toString(), project.end_date.toString())
      : 0;
  const totalCost = (project.day_price || 0) * (totalDays || 0);
  const usedCost = (project.day_price || 0) * workedDays;
  const costPercentage = totalCost ? ((usedCost / totalCost) * 100).toFixed(2) : '0.00';
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="border rounded-lg col-span-3">
          <div className="grid grid-cols-2 gap-4 p-3">
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
            <div>
              <label className="text-gray-500 mb-10">ค่าใช้จ่ายต่อวัน</label>
              <div className="mt-1">
                {project.day_price ? numberWithCommas(project.day_price) : 0} บาท
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-lg col-span-2 p-3 flex flex-col h-full">
          <div className="mb-2">เวลาที่ใช้ในโครงการ</div>
          <div className="grid grid-cols-6 gap-4 flex-1">
            <div className="col-span-2 border rounded-lg px-3 py-1 flex flex-col text-center">
              <div className="ms-auto">ปี</div>
              <div className="text-lg font-bold">{workDuration.year}</div>
            </div>
            <div className="col-span-2 border rounded-lg px-3 py-1 flex flex-col text-center">
              <div className="ms-auto">เดือน</div>
              <div className="text-lg font-bold">{workDuration.month}</div>
            </div>
            <div className="col-span-2 border rounded-lg px-3 py-1 flex flex-col text-center">
              <div className="ms-auto">วัน</div>
              <div className="text-lg font-bold">{workDuration.day}</div>
            </div>
            <div className="col-span-3 border rounded-lg px-3 py-1 flex flex-col text-center">
              <div className="ms-auto">ชั่วโมง</div>
              <div className="text-lg font-bold">{workDuration.hour}</div>
            </div>
            <div className="col-span-3 border rounded-lg px-3 py-1 flex flex-col text-center">
              <div className="ms-auto">นาที</div>
              <div className="text-lg font-bold">{workDuration.minute}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col border rounded-lg p-3">
          <div>จำนวนวัน</div>
          <div className="flex flex-nowrap items-baseline justify-center">
            <div className="text-3xl font-semibold">
              {workedDays}/{totalDays}
            </div>{' '}
            <div className="ms-2">วัน</div>
          </div>
        </div>
        <div className="flex flex-col border rounded-lg p-3">
          <div className="flex justify-between">
            <div>ค่าใช้จ่าย</div>
            <div>{costPercentage}% ของโครงการ</div>
          </div>
          <div className="flex flex-nowrap items-baseline justify-center">
            <div className="text-3xl font-semibold">
              {numberWithCommas(usedCost)}/{numberWithCommas(totalCost)}
            </div>{' '}
            <div className="ms-2">บาท</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CardProjectInfo;
