'use client';

import TitleGroup from '@/components/ui/custom/cev/title-group';
import LabelGroup from '@/components/ui/custom/form/label-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/lib/functions/date-format';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { formatRangeNumberWithComma } from '@/lib/functions/number-format';
import { IUser } from '@/types/setting/user';
import { useEffect, useState } from 'react';

const UserViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const [userData, setUserData] = useState<IUser>();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/v1/setting/user/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const userData = result.data;
          setUserData(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (id) {
      fetchUserData();
    }
  }, [id]);

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลผู้ใช้งาน" />
      <div className="flex flex-col px-0 lg:px-8 gap-5">
        <LabelGroup label="อีเมล" value={userData?.email} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <LabelGroup label="ชื่อ" value={userData?.first_name} />
          <LabelGroup label="นามสกุล" value={userData?.last_name} />
          <LabelGroup label="ชื่อเล่น" value={userData?.nick_name} />
          <LabelGroup label="รหัสพนักงาน" value={userData?.code} />
          <LabelGroup label="ทีม" value={userData?.team.name} />
          <LabelGroup label="ตำแหน่ง" value={userData?.position_level?.name} />
          <LabelGroup label="วันที่เริ่มงาน" value={formatDate(userData?.start_date) || '-'} />
          <LabelGroup label="วันที่สิ้นสุด" value={formatDate(userData?.end_date) || '-'} />
          <LabelGroup label="สิทธิ์การใช้งาน" value={userData?.role?.name} />
          <LabelGroup
            label="ช่วงเงินเดือนโดยประมาณ"
            value={
              userData?.salary_range ? formatRangeNumberWithComma(userData?.salary_range) : '-'
            }
          />
          <LabelGroup label="สถานะการใช้งาน" value="">
            <div className="flex items-center space-x-2">
              <Switch
                checked={userData?.is_active as boolean}
                aria-readonly
                disabled
                className="disabled:opacity-80"
                id="is-user-active"
              />
              <Label htmlFor="is-user-active" className="peer-disabled:opacity-80 text-base">
                {getIsActive(userData?.is_active as boolean)}
              </Label>
            </div>
          </LabelGroup>
        </div>
      </div>
    </div>
  );
};
export default UserViewDetail;
