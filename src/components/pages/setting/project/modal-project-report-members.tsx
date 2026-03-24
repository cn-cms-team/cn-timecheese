'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IOptionGroups } from '@/types/dropdown';
import { IProjectReportMember } from '@/types/setting/project';
import {
  handleAddProjectReportMember,
  handleRemoveProjectReportMember,
} from '@/components/pages/setting/project/actions';
import { ComboboxSingle } from '@/components/ui/custom/combobox';

interface ModalProjectReportMembersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  members: IProjectReportMember[];
  onMembersChanged: (members: IProjectReportMember[]) => void;
}

export default function ModalProjectReportMembers({
  open,
  onOpenChange,
  projectId,
  members,
  onMembersChanged,
}: ModalProjectReportMembersProps) {
  const [userOptions, setUserOptions] = useState<IOptionGroups[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string>('');

  useEffect(() => {
    const fetchUserOptions = async () => {
      if (!open) {
        return;
      }

      try {
        setIsLoadingUsers(true);
        const response = await fetch('/api/v1/master/user', { method: 'GET' });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || 'Failed to fetch user options');
        }

        const data: IOptionGroups[] = (result.data ?? []).map((group: IOptionGroups) => ({
          ...group,
          options: (group.options ?? []).filter((option) => option.is_active),
        }));

        setUserOptions(data.filter((group) => group.options && group.options.length > 0));
      } catch (error) {
        toast.error('ไม่สามารถโหลดรายชื่อผู้ใช้งานได้');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUserOptions();
  }, [open]);

  const availableUserOptions = useMemo(() => {
    const existingUserIdSet = new Set(members.map((member) => member.user_id));

    return userOptions
      .map((group) => ({
        heading: group.label,
        options: (group.options ?? [])
          .filter((option) => !existingUserIdSet.has(option.value))
          .map((option) => ({
            label: option.label,
            value: option.value,
            team: group.label,
            position: option.position,
          })),
      }))
      .filter((group) => group.options.length > 0);
  }, [members, userOptions]);

  const availableUserMap = useMemo(() => {
    return new Map(
      availableUserOptions.flatMap((group) => group.options.map((option) => [option.value, option]))
    );
  }, [availableUserOptions]);

  const handleAddMember = async () => {
    const userId = selectedUserId;
    if (!userId || isAdding) {
      return;
    }

    try {
      setIsAdding(true);
      const result = await handleAddProjectReportMember(projectId, userId);
      if (!result.success) {
        toast.error(result.message || 'ไม่สามารถเพิ่มสิทธิ์ดูรายงานได้');
        return;
      }

      const selectedUser = availableUserMap.get(userId);
      if (!selectedUser) {
        toast.error('ไม่พบข้อมูลผู้ใช้งานที่เลือก');
        return;
      }

      onMembersChanged([
        ...members,
        {
          user_id: userId,
          name: selectedUser.label,
          team: selectedUser.team,
          position: selectedUser.position ?? '-',
        },
      ]);
      setSelectedUserId('');
      toast.success(result.message || 'เพิ่มสิทธิ์ดูรายงานสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถเพิ่มสิทธิ์ดูรายงานได้');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (removingUserId) {
      return;
    }

    try {
      setRemovingUserId(userId);
      const result = await handleRemoveProjectReportMember(projectId, userId);
      if (!result.success) {
        toast.error(result.message || 'ไม่สามารถลบสิทธิ์ดูรายงานได้');
        return;
      }

      onMembersChanged(members.filter((member) => member.user_id !== userId));
      toast.success(result.message || 'ลบสิทธิ์ดูรายงานสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถลบสิทธิ์ดูรายงานได้');
    } finally {
      setRemovingUserId('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={true} className="sm:max-w-175">
        <DialogHeader>
          <DialogTitle>สิทธิ์ดูรายงาน</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="text-sm font-medium">เพิ่มผู้ใช้งาน</div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <ComboboxSingle
              options={availableUserOptions}
              placeholder={
                isLoadingUsers ? 'กำลังโหลดรายชื่อผู้ใช้งาน...' : 'เลือกผู้ใช้งานที่ต้องการเพิ่ม'
              }
              className="w-full"
              modalPopover={true}
              onValueChange={setSelectedUserId}
              value={selectedUserId}
              searchable={true}
              emptyText="ไม่พบข้อมูล"
              disabled={isLoadingUsers || availableUserOptions.length === 0 || isAdding}
            />
            <Button type="button" onClick={handleAddMember} disabled={isAdding || !selectedUserId}>
              เพิ่มผู้ใช้งาน
            </Button>
          </div>
          {availableUserOptions.length === 0 && !isLoadingUsers && (
            <div className="text-sm text-muted-foreground">ไม่มีผู้ใช้งานที่สามารถเพิ่มได้</div>
          )}
        </div>

        <div className="grid gap-3">
          <div className="text-sm font-medium">ผู้ใช้งานที่มีสิทธิ์ดูรายงาน</div>
          <div className="max-h-80 overflow-auto rounded-lg border">
            {members.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">ยังไม่มีข้อมูล</div>
            ) : (
              <div className="divide-y">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between gap-3 p-3">
                    <div className="text-sm">{member.name}</div>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => handleRemoveMember(member.user_id)}
                      disabled={Boolean(removingUserId) || isAdding}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
