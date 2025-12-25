'use client';

import LabelGroup from '@/components/ui/custom/form/label-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { calcTotalDays, formatDate } from '@/lib/functions/date-format';
import { getProjectStatus } from '@/lib/functions/enum-mapping';
import { IProject } from '@/types/setting/project';
import { useEffect, useState } from 'react';

const ProjectViewDetail = ({ id }: { id: string }): React.ReactNode => {
  const [projectData, setProjectData] = useState<IProject>();
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/v1/setting/project/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setProjectData(data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  return (
    <div className="flex flex-col gap-5 px-5">
      <div>
        <h2 className="font-medium text-lg mb-0">ข้อมูลโครงการ</h2>
        <hr className="mt-2 mb-5" />
        <div className="flex flex-col lg:px-8 gap-5 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <LabelGroup label="รหัสโครงการ" value={projectData?.code} />
            <LabelGroup label="ชื่อ" value={projectData?.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <LabelGroup
              label="วันที่เริ่มต้น"
              value={formatDate(projectData?.start_date, 'dd/mm/yyyy') || '-'}
            />
            <LabelGroup
              label="วันที่สิ้นสุด"
              value={formatDate(projectData?.end_date, 'dd/mm/yyyy') || '-'}
            />
            <LabelGroup
              label="สถานะโครงการ"
              value={getProjectStatus(projectData?.status!) || '-'}
            />
            <LabelGroup label="มูลค่าโครงการ" value={projectData?.value.toLocaleString() || '-'} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <LabelGroup label="คำอธิบาย" value={projectData?.description} />
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-medium text-lg mb-0">สมาชิก</h2>
        <hr className="mt-2 mb-5" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ชื่อ-สกุล</TableHead>
              <TableHead className="w-[100px]">ตำแหน่ง</TableHead>
              <TableHead className="w-[100px]">ค่าใช้จ่ายต่อวัน</TableHead>
              <TableHead className="w-[100px]">วันที่เริ่มต้น</TableHead>
              <TableHead className="w-[100px]">วันที่สิ้นสุด</TableHead>
              <TableHead className="w-[100px]">จำนวนวัน</TableHead>
              <TableHead className="w-[100px]">ค่าใช้จ่ายโดยประมาณ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectData?.member.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.day_price.toLocaleString()}</TableCell>
                <TableCell>
                  {item.start_date ? formatDate(item.start_date, 'dd/mm/yyyy') : '-'}
                </TableCell>
                <TableCell>
                  {item.end_date ? formatDate(item.end_date, 'dd/mm/yyyy') : '-'}
                </TableCell>
                <TableCell>{item.day_price.toLocaleString()}</TableCell>
                <TableCell>
                  {item.start_date && item.end_date
                    ? calcTotalDays(item.start_date, item.end_date)
                    : 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ProjectViewDetail;
