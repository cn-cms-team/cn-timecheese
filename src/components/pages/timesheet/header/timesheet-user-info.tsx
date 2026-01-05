'use client';
import { buddhistFormatDate } from '@/lib/functions/date-format';

import UserProfileImage from '@/components/ui/icons/user-profile-img';
import { useTimeSheetContext } from '../view/timesheet-context';

const TimeSheetUserInfo = () => {
  const { userInfo } = useTimeSheetContext();

  return (
    <div className="lg:col-span-2 bg-white p-4 rounded-lg">
      <h1 className="text-2xl text-gray-400 mb-4">ข้อมูลผู้ใช้งาน</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="flex  justify-center mx-4 lg:mb-0 mb-4">
          <UserProfileImage />
        </div>
        <div className="flex flex-col w-full ps-4">
          <div className="text-xl text-center lg:text-start mb-4">
            {userInfo?.user?.full_name || '-'} ({userInfo?.user?.nick_name || '-'})
          </div>
          <div className="flex gap-4 items-center justify-center lg:justify-start ">
            <div className="flex flex-col ">
              <span className="text-sm text-gray-400">ทีม</span>
              <span className="text-base">{userInfo?.user?.team || '-'}</span>
            </div>
            <div className="flex flex-col ">
              <span className="text-sm text-gray-400">ตำแหน่ง</span>
              <span className="text-sm">{userInfo?.user?.position_level}</span>
            </div>

            <div className="flex flex-col ">
              <span className="text-sm text-gray-400">วันที่เริ่มงาน</span>
              <span className="text-sm">
                {buddhistFormatDate(userInfo?.user?.start_date, 'dd mmmm yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSheetUserInfo;
