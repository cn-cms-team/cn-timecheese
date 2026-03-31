'use client';

import { Check, ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FEELING_OPTIONS, toneClasses } from '@/lib/constants/timesheet';
import { formatHours } from '@/lib/functions/date-format';
import { cn } from '@/lib/utils';
import { IApprovalPendingResponse, IApprovalPendingSummary } from '@/types/report/approval';
import { Feeling } from '@generated/prisma/enums';

type ApprovalMember = IApprovalPendingResponse['members'][number];

const DEFAULT_FEELING = Feeling.NEUTRAL;

type ApprovalDetailSectionProps = {
  selectedMemberId: string | null;
  selectedMember: ApprovalMember | null;
  selectedMemberSummaries: IApprovalPendingSummary[];
  approvingKey: string | null;
  onApprove: (item: IApprovalPendingSummary) => void;
  formatDate: (dateOnly: string) => string;
  formatTime: (dateTime: string) => string;
};

const ApprovalDetailSection = ({
  selectedMemberId,
  selectedMember,
  selectedMemberSummaries,
  approvingKey,
  onApprove,
  formatDate,
  formatTime,
}: ApprovalDetailSectionProps) => {
  return (
    <section className="flex-1 rounded-lg border bg-white p-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="text-base font-semibold">รายละเอียดรายการรออนุมัติ</h3>
        {selectedMember ? (
          <div className="pt-1 text-sm text-muted-foreground">
            {selectedMember.first_name} {selectedMember.last_name}{' '}
            {selectedMember.nick_name ? `(${selectedMember.nick_name})` : ''}
            {selectedMember.position_name ? ` | ${selectedMember.position_name}` : ''}
            {selectedMember.team_name ? ` | ${selectedMember.team_name}` : ''}
          </div>
        ) : null}
      </div>

      {!selectedMemberId ? (
        <div className="py-6 text-sm text-muted-foreground">กรุณาเลือกสมาชิกจากรายการด้านซ้าย</div>
      ) : selectedMemberSummaries.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">ไม่มีรายการรออนุมัติของสมาชิกคนนี้</div>
      ) : (
        <div className="flex flex-col gap-3 pt-3">
          {selectedMemberSummaries.map((item) => {
            const itemKey = `${item.user_id}|${item.project_id}|${item.sum_date}`;
            const isApproving = approvingKey === itemKey;

            return (
              <Collapsible
                key={itemKey}
                className="rounded-md border border-border/70"
                defaultOpen={true}
              >
                <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg text-foreground/80">{formatDate(item.sum_date)}</div>
                    <div className="text-sm text-muted-foreground">
                      รวมเวลา {formatHours(item.total_seconds)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ChevronDown className="size-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      size="sm"
                      disabled={isApproving || item.time_sheets.length === 0}
                      onClick={() => {
                        onApprove(item);
                      }}
                    >
                      {isApproving ? (
                        'กำลังอนุมัติ...'
                      ) : (
                        <>
                          <Check className="size-4" /> อนุมัติ
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="border-t bg-muted/20 p-3">
                    {item.time_sheets.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        ไม่พบรายการ timesheet ในวันดังกล่าว
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {item.time_sheets.map((timeSheet) => {
                          const taskTone = toneClasses[timeSheet.tone_color ?? 'slate'];
                          const feelingMeta =
                            FEELING_OPTIONS.find(
                              (option) => option.value === (timeSheet.feeling ?? DEFAULT_FEELING)
                            ) ?? FEELING_OPTIONS.find((option) => option.value === DEFAULT_FEELING);

                          return (
                            <div key={timeSheet.id} className="rounded-md border bg-white p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-sm font-medium">
                                  {formatTime(timeSheet.start_date)} -{' '}
                                  {formatTime(timeSheet.end_date)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatHours(timeSheet.total_seconds)}
                                </div>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-foreground/80">
                                <span>งาน:</span>
                                <Badge className={cn('border-0 rounded-md', taskTone.badge)}>
                                  {timeSheet.task_type_name || '-'}
                                </Badge>
                              </div>
                              <div className="text-sm text-foreground/80">
                                รายละเอียด: {timeSheet.detail || '-'}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-foreground/80">
                                <span>ความรู้สึกต่องาน:</span>
                                <Badge
                                  variant="outline"
                                  title={feelingMeta?.tooltip}
                                  className="rounded-md"
                                >
                                  <span aria-hidden>{feelingMeta?.emoji}</span>{' '}
                                  {feelingMeta?.label || '-'}
                                </Badge>
                              </div>
                              {timeSheet.remark && (
                                <div className="mt-1 text-sm text-foreground/80">
                                  ปัญหาหรือข้อเสนอแนะ: {timeSheet.remark}
                                </div>
                              )}
                              <div className="mt-1">
                                {timeSheet.is_work_from_home ? (
                                  <Badge variant="outline">WFH</Badge>
                                ) : (
                                  <Badge variant="secondary">Onsite</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ApprovalDetailSection;
