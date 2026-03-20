'use client';

import { useLoading } from '@/components/context/app-context';
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
import { buddhistFormatDate, calcTotalDays, formatDate } from '@/lib/functions/date-format';
import { getIsCompanyProject, getProjectStatus } from '@/lib/functions/enum-mapping';
import { IProject, IProjectTaskType } from '@/types/setting/project';
import { useEffect, useState } from 'react';

const ProjectViewDetail = ({
  id,
  onDataLoaded,
}: {
  id: string;
  onDataLoaded: (name: string, reportMembers: IProject['report_members']) => void;
}): React.ReactNode => {
  const { setIsLoading } = useLoading();
  const [projectData, setProjectData] = useState<IProject>();
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/setting/project/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          setProjectData(data);
          onDataLoaded(data.name, data.report_members ?? []);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
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
            <TableHead className="w-25">หมวดหมู่</TableHead>
            <TableHead className="w-25">ประเภทงาน</TableHead>
            <TableHead className="w-50">คำอธิบาย</TableHead>
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
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <LabelGroup
                label="ประเภทโครงการ"
                value={getIsCompanyProject(projectData?.is_company_project ?? false) || '-'}
              />
              <LabelGroup label="รหัส Pre-Sale" value={projectData?.pre_sale_code} />
              <LabelGroup label="รหัสโครงการ" value={projectData?.code} />

              <LabelGroup label="ชื่อโครงการ" value={projectData?.name} />
              <LabelGroup
                label="วันที่เริ่มต้นโครงการ"
                value={buddhistFormatDate(projectData?.start_date, 'dd mmm yyyy') || '-'}
              />
              <LabelGroup
                label="วันที่สิ้นสุดโครงการ"
                value={buddhistFormatDate(projectData?.end_date, 'dd mmm yyyy') || '-'}
              />
              <LabelGroup
                label="วันที่เริ่มต้นการบำรุงรักษา"
                value={
                  buddhistFormatDate(projectData?.maintenance_start_date, 'dd mmm yyyy') || '-'
                }
              />
              <LabelGroup
                label="วันที่สิ้นสุดการบำรุงรักษา"
                value={buddhistFormatDate(projectData?.maintenance_end_date, 'dd mmm yyyy') || '-'}
              />
              <LabelGroup
                label="สถานะโครงการ"
                value={getProjectStatus(projectData?.status!) || '-'}
              />
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
                  <TableHead className="w-25">ชื่อ-สกุล</TableHead>
                  <TableHead className="w-25">ตำแหน่ง</TableHead>
                  <TableHead className="w-25">วันที่เริ่มต้น</TableHead>
                  <TableHead className="w-25">วันที่สิ้นสุด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectData?.member.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
                        <TableCell>
                          {item.start_date
                            ? buddhistFormatDate(item.start_date, 'dd mmm yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {item.end_date ? buddhistFormatDate(item.end_date, 'dd mmm yyyy') : '-'}
                        </TableCell>
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
