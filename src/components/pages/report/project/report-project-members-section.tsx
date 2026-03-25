'use client';

import { calcTotalYearAndMonth } from '@/lib/functions/date-format';
import { IReportProjectMember } from '@/types/report/project';
import { useMemo } from 'react';

type ReportProjectMembersSectionProps = {
  isLoading: boolean;
  projectMember: IReportProjectMember[];
  onOpenMemberModal: (userId: string) => void;
};

const ReportProjectMembersSection = ({
  isLoading,
  projectMember,
  onOpenMemberModal,
}: ReportProjectMembersSectionProps) => {
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

  return (
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
                  const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim();

                  return (
                    <button
                      type="button"
                      key={member.user_id}
                      className="w-full text-left rounded-lg border bg-background/90 p-4 shadow-xs transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                      onClick={() => onOpenMemberModal(member.user_id)}
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
                          ตำแหน่งในโครงการ: {member.position_level?.name || '-'}
                        </p>
                        <p className="text-muted-foreground">
                          อายุงาน:{' '}
                          {member.start_date
                            ? calcTotalYearAndMonth(
                                `${member.start_date}`,
                                new Date().toISOString()
                              )
                            : '-'}
                        </p>
                      </div>
                    </button>
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
  );
};

export default ReportProjectMembersSection;
