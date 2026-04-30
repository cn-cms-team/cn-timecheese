'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { IOkrObjectiveDetail } from '@/types/okr';

const getPercent = (progress: number, target: number) => {
  if (target <= 0) {
    return 0;
  }

  return Number(((progress / target) * 100).toFixed(2));
};

const OkrDetail = ({ data }: { data: IOkrObjectiveDetail }) => {
  return (
    <div className="space-y-4">
      <Card className="gap-4 py-4">
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>เจ้าของ: {data.owner.name}</span>
            <span>สร้างเมื่อ: {buddhistFormatDate(data.created_at, 'dd mmm yyyy')}</span>
            <span>
              อัปเดตล่าสุด:{' '}
              {data.updated_at ? buddhistFormatDate(data.updated_at, 'dd mmm yyyy') : '-'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-muted-foreground text-sm">ความคืบหน้ารวม</p>
              <p className="text-2xl font-semibold">{data.progress.percent.toLocaleString()}%</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-muted-foreground text-sm">ความคืบหน้าที่ทำได้</p>
              <p className="text-2xl font-semibold">
                {data.progress.total_progress.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-muted-foreground text-sm">เป้าหมายรวม</p>
              <p className="text-2xl font-semibold">
                {data.progress.total_target.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(data.progress.percent, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {data.key_results.map((item, index) => {
          const percent = getPercent(item.progress, item.target);

          return (
            <Card key={item.id ?? `${item.title}-${index}`} className="gap-4 py-4">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {buddhistFormatDate(item.start_date, 'dd mmm yyyy')} -{' '}
                    {buddhistFormatDate(item.end_date, 'dd mmm yyyy')}
                  </p>
                </div>
                <Badge variant="outline">{item.unit || 'ไม่มีหน่วย'}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ความคืบหน้า</span>
                  <span className="font-medium">{percent.toLocaleString()}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ค่าเป้าหมาย</p>
                    <p className="font-medium">{item.target.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ค่าปัจจุบัน</p>
                    <p className="font-medium">{item.progress.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OkrDetail;
