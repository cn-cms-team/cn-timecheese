'use client';

import LabelGroup from '@/components/ui/custom/form/label-group';
import { getIsActive } from '@/lib/functions/enum-mapping';
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
          console.log('Fetched user data:', userData);
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
    <div className="flex flex-col px-5">
      <h2 className="font-medium text-lg mb-0">ข้อมูลผู้ใช้งาน</h2>
      <hr className="mt-2 mb-5" />
      <div className="flex flex-col px-8 gap-5">
        <LabelGroup label="อีเมล" value={userData?.email} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <LabelGroup label="ชื่อ" value={userData?.first_name} />
          <LabelGroup label="นามสกุล" value={userData?.last_name} />
          <LabelGroup label="ชื่อเล่น" value={userData?.nick_name} />
          <LabelGroup label="ทีม" value={userData?.team.name} />
          <LabelGroup label="ตำแหน่ง" value={userData?.position_level?.name} />
          <LabelGroup label="วันที่เริ่มงาน" value={userData?.start_date?.toString() || '-'} />
          <LabelGroup label="วันที่สิ้นสุด" value={userData?.end_date?.toString() || '-'} />
          <LabelGroup label="สิทธิ์การใช้งาน" value={userData?.role?.name} />
          <LabelGroup label="สถานะการใช้งาน" value={getIsActive(userData?.isActive || false)} />
        </div>
      </div>
    </div>
  );
};
export default UserViewDetail;
