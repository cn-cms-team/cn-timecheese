'use client';

import CardProjectInfo from '@/components/ui/custom/report/card-project-info';
import { IProjectInfoByUser } from '@/types/report';
import { useEffect, useMemo, useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import EmptyFolderIcon from '@/components/ui/icons/empty-folder';
import { Label } from '@/components/ui/label';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { IOptionGroups } from '@/types/dropdown';
import ReportProjectBarChart from './report-project-bar-chart';
import { IReportProjectMember } from '@/types/report/project';
import { buddhistFormatDate, calcTotalYearAndMonth } from '@/lib/functions/date-format';

const ReportProjectContent = () => {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOptionGroups[]>([]);
  const [projectMember, setProjectMember] = useState<IReportProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<IProjectInfoByUser>(null!);

  const groupedMembers = useMemo(() => {
    return projectMember.reduce<Record<string, IReportProjectMember[]>>((acc, member) => {
      const teamKey = member.team_name?.trim() || 'ไม่ระบุทีม';

      if (!acc[teamKey]) {
        acc[teamKey] = [];
      }

      acc[teamKey].push(member);
      return acc;
    }, {});
  }, [projectMember]);

  const onChangeProject = (id: string) => {
    setProjectId(id);
    setProjectInfo(null!);
    setProjectMember([]);
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

          <section className="w-full border rounded-md p-4 shadow-sm mt-3">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-base font-semibold">สมาชิกในโครงการ</h2>
              {!isLoading ? (
                <span className="text-sm text-muted-foreground">
                  ทั้งหมด {projectMember.length.toLocaleString()} คน
                </span>
              ) : null}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`member-skeleton-${index}`}
                    className="h-28 rounded-lg border bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : projectMember.length ? (
              <div className="space-y-5">
                {Object.entries(groupedMembers).map(([teamName, members]) => (
                  <div key={teamName}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{teamName}</h3>
                      <span className="text-xs text-muted-foreground">
                        {members.length.toLocaleString()} คน
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {members.map((member) => {
                        const fullName =
                          `${member.first_name || ''} ${member.last_name || ''}`.trim();

                        return (
                          <article
                            key={member.user_id}
                            className="rounded-lg border bg-background/90 p-4 shadow-xs transition-colors hover:bg-muted/30"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-medium leading-tight">{fullName || '-'}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  รหัส: {member.code || '-'}
                                </p>
                              </div>
                              {member.nick_name ? (
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                  {member.nick_name}
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-4 space-y-1 text-sm">
                              <p className="text-muted-foreground">
                                ตำแหน่ง: {member.position_level?.name || '-'}
                              </p>
                              <p className="text-muted-foreground">
                                วันที่เข้าร่วม:{' '}
                                {member.start_date
                                  ? calcTotalYearAndMonth(
                                      `${member.start_date}`,
                                      new Date().toISOString()
                                    )
                                  : '-'}
                              </p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                ไม่พบข้อมูลสมาชิกในโครงการ
              </div>
            )}
          </section>
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
