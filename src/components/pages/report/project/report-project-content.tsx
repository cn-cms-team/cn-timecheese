'use client';
import Dropdown from '@/components/ui/custom/input/dropdown';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';

import { IProjectInfoByUser, IReportProject } from '@/types/report';
import { useEffect, useState } from 'react';
import ReportUsersButton from '../report-users-button';
import { UserAvatarProps } from '@/components/ui/custom/avatar/user-avatar';
import { IOption } from '@/types/option';
import { fetcher } from '@/lib/fetcher';
import AvatarDetail from '@/components/ui/custom/avatar/user-detail';
import DonutChartTimeSheet from '@/components/ui/custom/report/donut-chart-timesheet';
import TableListTimeSheet from '@/components/ui/custom/report/table-list-timesheet';
import EmptyFolderIcon from '@/components/ui/icons/empty-folder';
import { Label } from '@/components/ui/label';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { IOptionGroups } from '@/types/dropdown';
import ReportProjectBarChart from './report-project-bar-chart';

const ReportProjectContent = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOptionGroups[]>([]);
  const [memberId, setMemberId] = useState<string>(null!);
  const [memberOptions, setMemberOptions] = useState<(IOption & UserAvatarProps)[]>([]);
  const [reportProjectData, setReportProjectData] = useState<IReportProject>(null!);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<IProjectInfoByUser>(null!);

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
    // const fetchMembers = async () => {
    //   try {
    //     const user = await fetcher<(IOption & UserAvatarProps)[]>(
    //       `${prefix}/api/v1/report/project/${projectId}/members`
    //     );
    //     setMemberOptions(
    //       user.map((item) => ({
    //         ...item,
    //         name: item.label,
    //         image: '',
    //         is_active: item.value === memberId,
    //       }))
    //     );
    //     onChangeProject(projectId);
    //   } catch (error) {
    //     console.error('Error fetching member options:', error);
    //   }
    // };
    // if (projectId) {
    //   fetchMembers();
    // }
    const fetchProjectInfo = async () => {
      try {
        setIsLoading(true);
        const projectData = await fetcher<IProjectInfoByUser>(
          `${prefix}/api/v1/report/project/${projectId}`
        );
        setProjectInfo(projectData);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
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
        <div className="flex flex-col justify-end">
          <ReportUsersButton onClick={onClickUser} userList={memberOptions} />
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
