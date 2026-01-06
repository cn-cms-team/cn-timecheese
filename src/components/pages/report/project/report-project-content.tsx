import Dropdown from '@/components/ui/custom/input/dropdown';
import CardProjectInfo from '@/components/ui/custom/report/card-project-info';

import { IOptions } from '@/types/dropdown';
import { IProjectReportBase, IReportProject } from '@/types/report';
import { report } from 'process';
import { use, useEffect, useState } from 'react';

const ReportProjectContent = () => {
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOptions[]>([]);
  const [memberId, setMemberId] = useState<string>(null!);
  const [memberOptions, setMemberOptions] = useState<IOptions[]>([]);
  const [reportProjectData, setReportProjectData] = useState<IReportProject>(null!);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/v1/report/project/project-list');
      const data = await response.json();
      setProjectOptions(data.data as IOptions[]);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch(`/api/v1/report/project/member-list?project_id=${projectId}`);
      const data = await response.json();
      setMemberOptions(data.data as IOptions[]);
    };
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      const response = await fetch(
        `/api/v1/report/project?project_id=${projectId}&member_id=${memberId}`
      );
      const data = await response.json();
      setReportProjectData(data.data);
    };
    if (memberId) {
      fetchProjectData();
    }
  }, [memberId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="w-1/3">
          <Dropdown
            value={projectId}
            options={projectOptions}
            canSearch
            onChange={(value) => setProjectId(value)}
            isAllPlaceHolder={false}
            placeholder="เลือกโครงการ"
          />
        </div>
        <div className="w-1/3">
          <Dropdown
            disabled={!projectId}
            value={memberId}
            options={memberOptions}
            canSearch
            onChange={(value) => setMemberId(value)}
            isAllPlaceHolder={false}
            placeholder="เลือกสมาชิก"
          />
        </div>
      </div>
      {reportProjectData ? (
        <CardProjectInfo project={reportProjectData.project} />
      ) : projectId && memberId ? (
        <div className="flex w-full justify-center">ไม่พบข้อมูลรายงานโครงการ</div>
      ) : (
        <div className="flex w-full justify-center">เลือกโครงการและสมาชิก</div>
      )}
    </div>
  );
};
export default ReportProjectContent;
