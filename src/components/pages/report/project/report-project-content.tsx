'use client';
import Dropdown from '@/components/ui/custom/input/dropdown';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';

import { IReportProject } from '@/types/report';
import { useEffect, useState } from 'react';
import ReportUsersButton from '../../reports/report-users-button';
import { UserAvatarProps } from '@/components/ui/custom/avatar/user-avatar';
import { IOption } from '@/types/option';
import { fetcher } from '@/lib/fetcher';
import { set } from 'zod';
import AvatarDetail from '@/components/ui/custom/avatar/user-detail';
import DonutChartTimesheet from '@/components/ui/custom/report/donut-chart-timesheet';
import TableListTimesheet from '@/components/ui/custom/report/table-list-timesheet';

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
        const project = await fetcher<IOption[]>(`${prefix}//api/v1/report/project/project-list`);
        setProjectOptions(project);
      } catch (error) {
        console.error('Error fetching options:', error);
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
        console.error('Error fetching options:', error);
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
        console.error('Error fetching options:', error);
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
      <div className="flex gap-3">
        <div className="w-1/2 lg:w-1/4">
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
      {reportProjectData && !isLoading ? (
        <>
          <div className="border rounded-lg">
            <AvatarDetail
              name={reportProjectData.user.full_name}
              image={reportProjectData.user?.image || ''}
              position={reportProjectData.user.position}
              code={reportProjectData.user?.code}
              start_date={reportProjectData.user?.start_date}
              salary_range={reportProjectData.user?.saraly_range}
            />
          </div>
          <CardProjectInfo project={reportProjectData.project} />
          <DonutChartTimesheet donutLabel={reportProjectData.timesheet_chart} />
          <TableListTimesheet />
        </>
      ) : isLoading ? (
        <div className="flex w-full justify-center">กำลังโหลดข้อมูล...</div>
      ) : projectId && memberId && !reportProjectData ? (
        <div className="flex w-full justify-center">ไม่พบข้อมูลรายงานโครงการ</div>
      ) : (
        <div className="flex w-full justify-center">เลือกโครงการและสมาชิก</div>
      )}
    </div>
  );
};
export default ReportProjectContent;
