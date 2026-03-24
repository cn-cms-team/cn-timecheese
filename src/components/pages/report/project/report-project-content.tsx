'use client';

import CardProjectInfo from '@/components/ui/custom/report/card-project-info';
import { IProjectInfoByUser } from '@/types/report';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import EmptyFolderIcon from '@/components/ui/icons/empty-folder';
import { Label } from '@/components/ui/label';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { IOptionGroups } from '@/types/dropdown';
import ReportProjectBarChart from './report-project-bar-chart';
import { IReportProjectMember } from '@/types/report/project';

const ReportProjectContent = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOptionGroups[]>([]);
  const [projectMember, setProjectMember] = useState<IReportProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<IProjectInfoByUser>(null!);

  const onChangeProject = (id: string) => {
    setProjectId(id);
    setProjectInfo(null!);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const project = await fetcher<IOptionGroups[]>(
          `${prefix}/api/v1/report/project/project-list`
        );
        setProjectOptions(project);
      } catch (error) {
        console.error('Error fetching project options:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!projectId) {
      setProjectInfo(null!);
      setProjectMember([]);
      return;
    }

    let cancelled = false;

    const fetchProjectData = async () => {
      try {
        setIsLoading(true);

        const [projectData, projectMembers] = await Promise.all([
          fetcher<IProjectInfoByUser>(`${prefix}/api/v1/report/project/${projectId}`),
          fetcher<IReportProjectMember[]>(`${prefix}/api/v1/report/project/${projectId}/members`),
        ]);

        if (cancelled) return;

        setProjectInfo(projectData);
        setProjectMember(projectMembers);
      } catch (error) {
        console.error('Error fetching project report data:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProjectData();

    return () => {
      cancelled = true;
    };
  }, [projectId, prefix]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex md:flex-row flex-col gap-3 justify-between content-center">
        <div className="w-full md:max-w-sm">
          <Label>โครงการ</Label>
          <ComboboxForm
            value={projectId}
            isGroup={true}
            placeholder="เลือกโครงการ"
            options={projectOptions}
            onSelect={(value) => {
              setProjectId(value);
            }}
          />
        </div>
      </div>
      {projectId ? (
        <div>
          <CardProjectInfo project={projectInfo || {}} isLoading={isLoading} />
          <ReportProjectBarChart projectId={projectId} isLoading={isLoading} />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full justify-center p-10 gap-5 border rounded-lg shadow">
          <EmptyFolderIcon />
          <div className="text-xl font-semibold">กรุณาเลือกโครงการ</div>
        </div>
      )}

      {/* {reportProjectData ? (
        <>
          <div className="border rounded-lg shadow">
            <AvatarDetail
              id={reportProjectData.user.id}
              name={`${reportProjectData.user.first_name} ${reportProjectData.user.last_name}`}
              position={reportProjectData.user.position_level?.name}
              code={reportProjectData.user?.code}
              start_date={reportProjectData.user?.start_date}
              loading={isLoading}
            />
          </div>
          <CardProjectInfo project={reportProjectData.project} isLoading={isLoading} />
          <DonutChartTimeSheet donutLabel={reportProjectData.timeSheetChart} isLoading={isLoading} />
          {projectId && reportProjectData.user.id ? (
            <TableListTimeSheet projectId={projectId} userId={reportProjectData.user.id} />
          ) : null}
        </>
      ) : projectId && memberId && !reportProjectData && !isLoading ? (
        <div className="flex w-full justify-center border rounded-lg shadow">
          ไม่พบข้อมูลรายงานโครงการ
        </div>
      ) : (
        <div className="flex flex-col items-center w-full justify-center p-10 gap-5 border rounded-lg shadow">
          <EmptyFolderIcon />
          <div className="text-xl font-semibold">เลือกโครงการและสมาชิก</div>
        </div>
      )} */}
    </div>
  );
};
export default ReportProjectContent;
