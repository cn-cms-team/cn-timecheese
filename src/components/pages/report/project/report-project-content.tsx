'use client';
import Dropdown from '@/components/ui/custom/input/dropdown';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';

import { IReportProject } from '@/types/report';
import { useEffect, useState } from 'react';
import ReportUsersButton from '../report-users-button';
import { UserAvatarProps } from '@/components/ui/custom/avatar/user-avatar';
import { IOption } from '@/types/option';
import { fetcher } from '@/lib/fetcher';
import AvatarDetail from '@/components/ui/custom/avatar/user-detail';
import DonutChartTimesheet from '@/components/ui/custom/report/donut-chart-timesheet';
import TableListTimesheet from '@/components/ui/custom/report/table-list-timesheet';
import EmptyFolderIcon from '@/components/ui/icons/empty-folder';
import { Label } from '@/components/ui/label';

const ReportProjectContent = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOption[]>([]);
  const [memberId, setMemberId] = useState<string>(null!);
  const [memberOptions, setMemberOptions] = useState<(IOption & UserAvatarProps)[]>([]);
  const [reportProjectData, setReportProjectData] = useState<IReportProject>(null!);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickUser = (id: string) => {
    setMemberOptions(
      memberOptions.map((u) => ({
        ...u,
        is_active: u.value === id,
      }))
    );
    setMemberId(id);
  };

  const onChangeProject = (id: string) => {
    setProjectId(id);
    setMemberId(null!);
    setReportProjectData(null!);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const project = await fetcher<IOption[]>(`${prefix}/api/v1/report/project/project-list`);
        setProjectOptions(project);
      } catch (error) {
        console.error('Error fetching project options:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const user = await fetcher<(IOption & UserAvatarProps)[]>(
          `${prefix}/api/v1/report/project/member-list?project_id=${projectId}`
        );
        setMemberOptions(
          user.map((item) => ({
            ...item,
            name: item.label,
            image: '',
            is_active: item.value === memberId,
          }))
        );
      } catch (error) {
        console.error('Error fetching member options:', error);
      }
    };
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const projectData = await fetcher<IReportProject>(
          `${prefix}/api/v1/report/project?project_id=${projectId}&member_id=${memberId}`
        );
        setReportProjectData(projectData);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (memberId) {
      fetchProjectData();
    }
  }, [memberId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-3">
        <div className="w-1/2 lg:w-1/4">
          <Label>โครงการ</Label>
          <Dropdown
            value={projectId}
            options={projectOptions}
            canSearch
            onChange={(value) => onChangeProject(value)}
            isAllPlaceHolder={false}
            placeholder="เลือกโครงการ"
          />
        </div>
        <div>
          <ReportUsersButton onClick={onClickUser} userList={memberOptions} />
        </div>
      </div>
      {reportProjectData ? (
        <>
          <div className="border rounded-lg shadow">
            <AvatarDetail
              name={reportProjectData.user.full_name}
              position={reportProjectData.user.position}
              code={reportProjectData.user?.code}
              start_date={reportProjectData.user?.start_date}
              salary_range={reportProjectData.user?.saraly_range}
            />
          </div>
          <CardProjectInfo
            project={reportProjectData.project}
            displayCost={true}
            loading={isLoading}
          />
          <DonutChartTimesheet donutLabel={reportProjectData.timesheet_chart} loading={isLoading} />
          <TableListTimesheet projectId={projectId} />
        </>
      ) : projectId && memberId && !reportProjectData && !isLoading ? (
        <div className="flex w-full justify-center">ไม่พบข้อมูลรายงานโครงการ</div>
      ) : (
        <div className="flex flex-col items-center w-full justify-center p-10 gap-5">
          <EmptyFolderIcon />
          <div className="text-xl font-semibold">เลือกโครงการและสมาชิก</div>
        </div>
      )}
    </div>
  );
};
export default ReportProjectContent;
