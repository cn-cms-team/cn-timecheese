'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import DetailViewSkeleton from '@/components/pages/okrs/detail-view-skeleton';
import { Button } from '@/components/ui/button';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { fetcher } from '@/lib/fetcher';
import { IOkrObjectiveDetail } from '@/types/okr';

import OkrDetail from '../okr-detail';

const OkrDetailView = ({ id }: { id: string }) => {
  const router = useRouter();
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmType?: ConfirmType;
  }>({
    title: '',
    message: '',
    confirmType: ConfirmType.DELETE,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [getConfirmation, Confirmation] = useDialogConfirm();

  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/okrs/${id}`;
  const { data, error, isLoading } = useSWR(fetchUrl, (url) => fetcher<IOkrObjectiveDetail>(url));

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.warning('ไม่พบข้อมูล OKR หรือคุณไม่มีสิทธิ์เข้าถึง');
    router.push('/okrs');
  }, [error, router]);

  const onDelete = async () => {
    if (!data) {
      return;
    }

    try {
      setConfirmState({
        title: 'ลบข้อมูล',
        message: `คุณยืนยันที่จะลบ OKR : ${data.title} ใช่หรือไม่ ?`,
        confirmType: ConfirmType.DELETE,
      });

      const result = await getConfirmation();
      if (!result) {
        return;
      }

      setIsDeleting(true);
      const response = await fetch(`/api/v1/okrs/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        toast.warning(payload.message || 'ไม่สามารถลบข้อมูล OKR ได้');
        return;
      }

      toast.success(payload.message || 'ลบข้อมูลสำเร็จ');
      router.push('/okrs');
      router.refresh();
    } catch {
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!data && !isLoading) {
    return null;
  }

  return (
    <>
      <ModuleLayout
        headerTitle="รายละเอียด OKR"
        leaveUrl="/okrs"
        headerButton={
          data?.is_owner ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={() => router.push(`/okrs/${id}/edit`)}
              >
                <Pencil className="w-4 h-4" />
                แก้ไข
              </Button>
              <Button variant="destructive" disabled={isDeleting} onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
                ลบ
              </Button>
            </div>
          ) : null
        }
        content={isLoading ? <DetailViewSkeleton /> : data ? <OkrDetail data={data} /> : null}
      />

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};

export default OkrDetailView;
