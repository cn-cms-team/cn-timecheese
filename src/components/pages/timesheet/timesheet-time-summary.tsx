'use client';

const TimeSheetTimeSummary = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col bg-white p-2 rounded-md">
        <span>เวลาทั้งหมด</span>
        <span className="text-black">
          200 <span className="text-gray-300">ชั่วโมง</span>
        </span>
      </div>
      <div className="flex flex-col bg-white p-2 rounded-md">
        <span>ล่วงเวลา</span>
        <span className="text-black">
          10 <span className="text-gray-300">ชั่วโมง</span>
        </span>
      </div>
      <div className="flex flex-col bg-white p-2 rounded-md">
        <span>ไม่ได้ลงเวลา</span>
        <span className="text-black">
          0 <span className="text-gray-300">ชั่วโมง</span>
        </span>
      </div>
      <div className="flex flex-col bg-white p-2 rounded-md">
        <span>โครงการทั้งหมด</span>
        <span className="text-black">
          0 <span className="text-gray-300">ชั่วโมง</span>
        </span>
      </div>
    </div>
  );
};

export default TimeSheetTimeSummary;
