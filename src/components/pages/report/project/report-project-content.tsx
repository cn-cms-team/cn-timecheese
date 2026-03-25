'use client';

import CardProjectInfo from '@/components/ui/custom/report/card-project-info';
import { IDashboard, IProjectInfoByUser } from '@/types/report';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import EmptyFolderIcon from '@/components/ui/icons/empty-folder';
import { Label } from '@/components/ui/label';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { IOptionGroups } from '@/types/dropdown';
import ReportProjectBarChart from './report-project-bar-chart';
import { IReportProjectMember } from '@/types/report/project';
import ReportProjectMemberModal from './report-project-member-modal';
import ReportProjectMembersSection from './report-project-members-section';

const ReportProjectContent = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOptionGroups[]>([]);
  const [projectMember, setProjectMember] = useState<IReportProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<IProjectInfoByUser>(null!);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState<boolean>(false);
  const [selectedMemberInfo, setSelectedMemberInfo] = useState<IDashboard>(null!);
  const [isMemberInfoLoading, setIsMemberInfoLoading] = useState<boolean>(false);

  const onChangeProject = (id: string) => {
    setProjectId(id);
    setProjectInfo(null!);
    setProjectMember([]);
    setSelectedMemberInfo(null!);
    setIsMemberModalOpen(false);
  };

  const handleOpenMemberModal = async (userId: string) => {
    if (!projectId || !userId) {
      return;
    }

    setIsMemberModalOpen(true);
    setSelectedMemberInfo(null!);
    setIsMemberInfoLoading(true);

    try {
      const memberInfo = await fetcher<IDashboard>(
        `${prefix}/api/v1/dashboard?project_id=${projectId}&member_id=${userId}`
      );
      setSelectedMemberInfo(memberInfo);
    } catch (error) {
      console.error('Error fetching member info:', error);
      setSelectedMemberInfo(null!);
    } finally {
      setIsMemberInfoLoading(false);
    }
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
              onChangeProject(value);
            }}
          />
        </div>
      </div>
      {projectId ? (
        <div>
          <CardProjectInfo project={projectInfo || {}} isLoading={isLoading} />
          <ReportProjectBarChart projectId={projectId} isLoading={isLoading} />
          <ReportProjectMembersSection
            isLoading={isLoading}
            projectMember={projectMember}
            onOpenMemberModal={handleOpenMemberModal}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full justify-center p-10 gap-5 border rounded-lg shadow">
          <EmptyFolderIcon />
          <div className="text-xl font-semibold">กรุณาเลือกโครงการ</div>
        </div>
      )}

      <ReportProjectMemberModal
        projectId={projectId}
        open={isMemberModalOpen}
        onOpenChange={setIsMemberModalOpen}
        selectedMemberInfo={selectedMemberInfo}
        isMemberInfoLoading={isMemberInfoLoading}
      />
    </div>
  );
};
export default ReportProjectContent;
