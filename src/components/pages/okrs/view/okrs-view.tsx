'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Pencil, Plus, Trash2 } from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'sonner';

import { useLoading } from '@/components/context/app-context';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { fetcher } from '@/lib/fetcher';
import { IOkrObjectiveListItem } from '@/types/okr';

const OKRsView = () => {
  const { setIsLoading } = useLoading();
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmType?: ConfirmType;
  }>({
    title: '',
    message: '',
    confirmType: ConfirmType.DELETE,
  });
  const [getConfirmation, Confirmation] = useDialogConfirm();

  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/okrs`;
  const { data, error, isLoading, mutate } = useSWR(fetchUrl, (url) =>
    fetcher<IOkrObjectiveListItem[]>(url)
  );

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const onDelete = async (id: string, title: string) => {
    try {
      setConfirmState({
        title: 'ลบข้อมูล',
        message: `คุณยืนยันที่จะลบ OKR : ${title} ใช่หรือไม่ ?`,
        confirmType: ConfirmType.DELETE,
      });

      const result = await getConfirmation();
      if (!result) {
        return;
      }

      setIsLoading(true);
      const response = await fetch(`/api/v1/okrs/${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) {
        toast.warning(payload.message || 'ไม่สามารถลบข้อมูล OKR ได้');
        return;
      }

      toast.success(payload.message || 'ลบข้อมูลสำเร็จ');
      await mutate();
    } catch {
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return null;
  }

  return (
    <>
      <ModuleLayout
        headerTitle="OKRs"
        headerButton={
          <Button asChild>
            <Link href="/okrs/create">
              <Plus className="w-4 h-4" />
              เพิ่ม OKR
            </Link>
          </Button>
        }
        content={
          data && data.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {data.map((item) => (
                <Card key={item.id} className="gap-4 py-4">
                  <CardHeader className="flex flex-row items-start justify-between gap-3">
                    <div className="space-y-2">
                      <CardTitle>{item.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>เจ้าของ: {item.owner.name}</span>
                        <span>
                          ช่วงเวลา:{' '}
                          {item.start_date
                            ? buddhistFormatDate(item.start_date, 'dd mmm yyyy')
                            : '-'}
                          {' - '}
                          {item.end_date ? buddhistFormatDate(item.end_date, 'dd mmm yyyy') : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {item.is_owner ? (
                        <Badge>ของฉัน</Badge>
                      ) : (
                        <Badge variant="outline">ทีมเดียวกัน</Badge>
                      )}
                      <Badge variant="outline">{item.key_results_count} Key Results</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ความคืบหน้ารวม</span>
                      <span className="font-medium">{item.progress.percent.toLocaleString()}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(item.progress.percent, 100)}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">ค่าปัจจุบัน</p>
                        <p className="font-medium">
                          {item.progress.total_progress.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ค่าเป้าหมาย</p>
                        <p className="font-medium">{item.progress.total_target.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-between gap-2 border-t">
                    <Button variant="outline" asChild>
                      <Link href={`/okrs/${item.id}`}>
                        <ArrowRight className="w-4 h-4" />
                        รายละเอียด
                      </Link>
                    </Button>
                    {item.is_owner && (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/okrs/${item.id}/edit`}>
                            <Pencil className="w-4 h-4" />
                            แก้ไข
                          </Link>
                        </Button>
                        <Button variant="destructive" onClick={() => onDelete(item.id, item.title)}>
                          <Trash2 className="w-4 h-4" />
                          ลบ
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-lg font-medium">ยังไม่มี OKR ในทีม</p>
              <p className="text-muted-foreground mt-2">
                เริ่มต้นด้วยการสร้าง Objective พร้อม Key Results ของคุณ
              </p>
            </div>
          )
        }
      />

      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};

export default OKRsView;
