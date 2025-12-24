'use client';

import { useTimeSheetContext } from '../view/timesheet-context';

const TimeSheetTimeSummary = () => {
  const { userInfo } = useTimeSheetContext();
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col justify-center gap-2 bg-white p-2 rounded-md">
        <span>เวลาทั้งหมด</span>
        <span className="text-black">
          {userInfo?.total_tracked_hr} <span className="text-gray-300">ชั่วโมง</span>
        </span>
      </div>
      <div className="flex flex-col justify-center gap-2 bg-white p-2 rounded-md">
        <span>ล่วงเวลา</span>
        <span className="text-black">
          {userInfo?.total_trakced_overtimes} <span className="text-gray-300">ชั่วโมง</span>
        </span>
      </div>
      <div className="flex flex-col justify-center gap-2 bg-white p-2 rounded-md">
        <span>ไม่ได้ลงเวลา</span>
        <span className="text-black">
          0 <span className="text-gray-300">ชั่วโมง</span>
        </span>
      </div>
      <div className="flex flex-col justify-center gap-2 bg-white p-2 rounded-md">
        <span>โครงการทั้งหมด</span>
        <span className="text-black">
          {userInfo?.total_projects} <span className="text-gray-300">โครงการ</span>
        </span>
      </div>
    </div>
  );
};

export default TimeSheetTimeSummary;
