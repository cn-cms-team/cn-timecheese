'use client';
import { CalendarDays } from 'lucide-react';

import { PERIODCALENDAR } from '@/lib/constants/period-calendar';

import { Button } from '@/components/ui/button';
import TimeSheetColorLegend from './timesheet-color-legend';
import { useTimeSheetContext } from './view/timesheet-context';
import PeriodInput from '@/components/ui/custom/input/period-input';

const options = [
  { label: 'วัน', value: PERIODCALENDAR.DATE },
  { label: 'สัปดาห์', value: PERIODCALENDAR.WEEK },
  { label: 'เดือน', value: PERIODCALENDAR.MONTH },
];

const TimeSheetPeriodSelection = () => {
  const { period, setPeriod } = useTimeSheetContext();

  return (
    <div className="p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] z-50 ">
      <div className=" flex lg:flex-row flex-col gap-4 justify-between">
        <PeriodInput
          value={period}
          options={options}
          onSelect={(value) => setPeriod(value as PERIODCALENDAR)}
        />
        <TimeSheetColorLegend />
      </div>
      <div className="mt-4 w-full flex items-center flex-col lg:flex-row gap-4 ">
        <CalendarDays className="hidden lg:block" />
        <div className="flex items-center gap-4">
          <Button className="font-bold text-black text-lg flex justify-center items-center pt-0.5 cursor-pointer">
            {'<'}
          </Button>
          <div className="p-4 rounded-md w-24 bg-primary text-black text-center cursor-pointer">
            <span className="font-semibold ">จันทร์</span>
            <br />
            <span className="font-bold text-xl">17</span>
          </div>
          <Button className="font-bold text-black text-lg flex justify-center items-center pt-0.5 cursor-pointer">
            {'>'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeSheetPeriodSelection;
