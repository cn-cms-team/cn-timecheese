'use client';

import { TitleGroup } from '@/components/ui/custom/cev';
import LabelGroup from '@/components/ui/custom/form/label-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { taskTypeOption } from '@/lib/constants/task';
import { calcTotalDays, formatDate } from '@/lib/functions/date-format';
import { getProjectStatus } from '@/lib/functions/enum-mapping';
import { IProject, IProjectTaskType } from '@/types/setting/project';
import { useEffect, useState } from 'react';

const ProjectViewDetail = ({
  id,
  onDataLoaded,
}: {
  id: string;
  onDataLoaded: (name: string) => void;
}): React.ReactNode => {
  const [projectData, setProjectData] = useState<IProject>();
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/v1/setting/project/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setProjectData(data);
          onDataLoaded(data.name);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  interface TaskTableProps {
    tasks: IProjectTaskType[];
  }

  const TaskTable = ({ tasks }: TaskTableProps) => {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f2f4f7]">
            <TableHead className="w-[100px]">หมวดหมู่</TableHead>
            <TableHead className="w-[100px]">ประเภทงาน</TableHead>
            <TableHead className="w-[100px]">คำอธิบาย</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                ไม่มีข้อมูล
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((item, index) => {
              const taskTypeLabel = taskTypeOption.find((f) => f.value === item.type)?.label;
              return (
                <TableRow key={item.id}>
                  <TableCell>{taskTypeLabel}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="cev-box">
      <div className="flex flex-col gap-5">
        <div>
          <TitleGroup title="ข้อมูลโครงการ" />
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
              <LabelGroup
                label="มูลค่าโครงการ"
                value={projectData?.value?.toLocaleString() || '-'}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              <LabelGroup label="คำอธิบาย" value={projectData?.description} />
            </div>
          </div>
        </div>
        <div>
          <TitleGroup title="สมาชิก" />
          <div className="rounded-lg border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f2f4f7]">
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
                {projectData?.member.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      ไม่มีข้อมูล
                    </TableCell>
                  </TableRow>
                ) : (
                  projectData?.member.map((item) => {
                    const totalDays =
                      item.start_date && item.end_date
                        ? calcTotalDays(item.start_date, item.end_date)
                        : 0;
                    const estimatedCost =
                      item.day_price && totalDays ? item.day_price * totalDays : 0;
                    return (
                      <TableRow key={item.user_id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>{item.day_price?.toLocaleString() ?? 0}</TableCell>
                        <TableCell>
                          {item.start_date ? formatDate(item.start_date, 'dd/mm/yyyy') : '-'}
                        </TableCell>
                        <TableCell>
                          {item.end_date ? formatDate(item.end_date, 'dd/mm/yyyy') : '-'}
                        </TableCell>
                        <TableCell>{totalDays}</TableCell>
                        <TableCell>{estimatedCost.toLocaleString() ?? 0}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <TitleGroup title="ประเภทงานตั้งต้น" />
          <div className="rounded-lg border overflow-auto">
            <TaskTable tasks={projectData?.main_task_type ?? []} />
          </div>
        </div>
        <div>
          <TitleGroup title="ประเภทงานจำเพาะ" />
          <div className="rounded-lg border overflow-auto">
            <TaskTable tasks={projectData?.optional_task_type ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectViewDetail;
