import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Dropdown from '@/components/ui/custom/input/dropdown';
import { monthOption } from '@/lib/constants/period-calendar';
import { useState } from 'react';
import ReportProjectGenerateExcel from './report-project-generate-excel';

const ReportProjectGenerateDialog = ({ projectId }: { projectId: string }) => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectYear, setSelectYear] = useState<number>(today.getFullYear());

  const yearOption = Array.from({ length: 3 }, (_, i) => ({
    label: (today.getFullYear() - i).toString(),
    value: today.getFullYear() - i,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Download className="w-4 h-4" /> รายงานการลงเวลาประจำเดือน
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>รายงานการลงเวลาประจำเดือน</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-3 w-full">
          <div className="space-y-1 w-1/2">
            <Label>เดือน</Label>
            <Dropdown
              className="w-full"
              value={selectedMonth}
              options={monthOption}
              canEmpty={false}
              isAllPlaceHolder={false}
              placeholder="เลือกเดือน"
              onChange={(value) => setSelectedMonth(Number(value))}
            />
          </div>
          <div className="space-y-1 w-1/2">
            <Label>ปี</Label>
            <Dropdown
              className="w-full"
              value={selectYear}
              options={yearOption}
              canEmpty={false}
              isAllPlaceHolder={false}
              placeholder="เลือกปี"
              onChange={(value) => setSelectYear(Number(value))}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <ReportProjectGenerateExcel
            projectId={projectId}
            selectedMonth={selectedMonth}
            selectYear={selectYear}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportProjectGenerateDialog;
