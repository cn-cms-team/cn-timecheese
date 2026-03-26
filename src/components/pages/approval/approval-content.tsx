'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { handleApproveTimeSheetSummary } from '@/components/pages/approval/actions';
import ApprovalDetailSection from '@/components/pages/approval/approval-detail-section';
import { Badge } from '@/components/ui/badge';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import EmptyFolderIcon from '@/components/ui/icons/empty-folder';
import { Label } from '@/components/ui/label';
import { fetcher } from '@/lib/fetcher';
import { IOptionGroups } from '@/types/dropdown';
import {
  IApprovalActionPayload,
  IApprovalPendingResponse,
  IApprovalPendingSummary,
} from '@/types/report/approval';

const ApprovalContent = () => {
  const [projectId, setProjectId] = useState<string>(null!);
  const [projectOptions, setProjectOptions] = useState<IOptionGroups[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<IApprovalPendingResponse>({
    members: [],
    summaries: [],
  });
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [approvingKey, setApprovingKey] = useState<string | null>(null);

  const loadProjectOptions = useCallback(async () => {
    try {
      setIsProjectLoading(true);
      const options = await fetcher<IOptionGroups[]>('/api/v1/report/project/project-list');
      setProjectOptions(
        options.filter(
          (group): group is IOptionGroups =>
            Boolean(group) &&
            typeof group.label === 'string' &&
            Array.isArray(group.options) &&
            group.options.length > 0
        )
      );
    } catch (error) {
      console.error('Error fetching project options:', error);
      toast.error('Loading project options failed');
      setProjectOptions([]);
    } finally {
      setIsProjectLoading(false);
    }
  }, []);

  const loadPendingApprovals = useCallback(async (selectedProjectId: string) => {
    if (!selectedProjectId) {
      setPendingData({ members: [], summaries: [] });
      return;
    }

    try {
      setIsPendingLoading(true);
      const result = await fetcher<IApprovalPendingResponse>(
        `/api/v1/report/project/${selectedProjectId}/pending-approvals`
      );
      setPendingData(result);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      toast.error('Loading pending approvals failed');
      setPendingData({ members: [], summaries: [] });
    } finally {
      setIsPendingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjectOptions();
  }, [loadProjectOptions]);

  useEffect(() => {
    if (!projectId) {
      setSelectedMemberId(null);
      setPendingData({ members: [], summaries: [] });
      return;
    }
    loadPendingApprovals(projectId);
  }, [projectId, loadPendingApprovals]);

  useEffect(() => {
    if (pendingData.members.length === 0) {
      setSelectedMemberId(null);
      return;
    }

    setSelectedMemberId((currentMemberId) => {
      if (
        currentMemberId &&
        pendingData.members.some((member) => member.user_id === currentMemberId)
      ) {
        return currentMemberId;
      }

      return pendingData.members[0].user_id;
    });
  }, [pendingData.members]);

  const handleApprove = async (item: IApprovalPendingSummary) => {
    const actionPayload: IApprovalActionPayload = {
      user_id: item.user_id,
      project_id: item.project_id,
      sum_date: item.sum_date,
    };

    try {
      setApprovingKey(`${item.user_id}|${item.project_id}|${item.sum_date}`);
      const result = await handleApproveTimeSheetSummary(actionPayload);

      if (!result.success) {
        toast.error(result.message || 'อนุมัติไม่สำเร็จ');
        return;
      }

      toast.success(result.message);
      await loadPendingApprovals(item.project_id);
    } catch (error) {
      console.error('Error approving summary:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setApprovingKey(null);
    }
  };

  const memberCountLabel = useMemo(() => `${pendingData.members.length} คน`, [pendingData.members]);

  const summaryCountByMember = useMemo(() => {
    return pendingData.summaries.reduce<Record<string, number>>((acc, summary) => {
      acc[summary.user_id] = (acc[summary.user_id] || 0) + 1;
      return acc;
    }, {});
  }, [pendingData.summaries]);

  const selectedMember = useMemo(
    () => pendingData.members.find((member) => member.user_id === selectedMemberId) ?? null,
    [pendingData.members, selectedMemberId]
  );

  const selectedMemberSummaries = useMemo(() => {
    if (!selectedMemberId) {
      return [];
    }

    return pendingData.summaries.filter((summary) => summary.user_id === selectedMemberId);
  }, [pendingData.summaries, selectedMemberId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full md:max-w-sm">
        <Label>โครงการ</Label>
        <ComboboxForm
          value={projectId}
          isGroup={true}
          placeholder={isProjectLoading ? 'กำลังโหลดโครงการ...' : 'เลือกโครงการ'}
          options={projectOptions}
          disabled={isProjectLoading}
          onSelect={(value) => {
            setProjectId(value);
          }}
        />
      </div>

      {!projectId ? (
        <div className="flex flex-col items-center w-full justify-center p-10 gap-5 border rounded-lg shadow-sm bg-white">
          <EmptyFolderIcon />
          <div className="text-xl font-semibold">กรุณาเลือกโครงการ</div>
        </div>
      ) : isPendingLoading ? (
        <div className="flex items-center justify-center rounded-lg border bg-white p-10 text-muted-foreground">
          กำลังโหลดข้อมูลรออนุมัติ...
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-2">
          <section className="min-w-80 rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b pb-3">
              <h3 className="text-base font-semibold">สมาชิกที่มีรายการรออนุมัติ</h3>
              <Badge variant="secondary">{memberCountLabel}</Badge>
            </div>

            {pendingData.members.length === 0 ? (
              <div className="py-6 text-sm text-muted-foreground">
                ไม่พบสมาชิกที่มีรายการรออนุมัติ
              </div>
            ) : (
              <div className="flex max-h-140 flex-col gap-2 overflow-y-auto pt-3 pr-1">
                {pendingData.members.map((member) => {
                  const isSelected = selectedMemberId === member.user_id;

                  return (
                    <button
                      key={member.user_id}
                      type="button"
                      className={`rounded-md border px-3 py-2 text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border/70 bg-muted/20 hover:bg-muted/40'
                      }`}
                      onClick={() => {
                        setSelectedMemberId(member.user_id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium">
                          {member.first_name} {member.last_name}{' '}
                          {member.nick_name ? `(${member.nick_name})` : ''}
                        </div>
                        <Badge variant={isSelected ? 'default' : 'secondary'}>
                          {summaryCountByMember[member.user_id] || 0}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.position_name || '-'} | {member.team_name || '-'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <ApprovalDetailSection
            selectedMemberId={selectedMemberId}
            selectedMember={selectedMember}
            selectedMemberSummaries={selectedMemberSummaries}
            approvingKey={approvingKey}
            onApprove={handleApprove}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        </div>
      )}
    </div>
  );
};

const formatDate = (dateOnly: string) => {
  const date = new Date(`${dateOnly}T00:00:00Z`);
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
    weekday: 'long',
  });
};

const formatTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  });
};

export default ApprovalContent;
