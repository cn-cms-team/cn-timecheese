'use client';

import PeriodInput from '@/components/ui/custom/input/period-input';
import { PERIODCALENDAR } from '@/lib/constants/period-calendar';
import { useTimeSheetContext } from './view/timesheet-context';
import TimeSheetColorLegend from './timesheet-color-legend';

const options = [
  { label: 'วัน', value: PERIODCALENDAR.DATE },
  { label: 'เดือน', value: PERIODCALENDAR.MONTH },
  { label: 'ปี', value: PERIODCALENDAR.YEAR },
];

const TimeSheetPeriodSelection = () => {
  const { period, setPeriod } = useTimeSheetContext();

  return (
    <div className="p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] z-10 ">
      <div className=" flex lg:flex-row flex-col gap-4 justify-between">
        <PeriodInput
          value={period}
          options={options}
          onSelect={(value) => setPeriod(value as PERIODCALENDAR)}
        />
        <TimeSheetColorLegend />
      </div>
      <div className="mt-4">Date Selection area</div>
    </div>
  );
};

export default TimeSheetPeriodSelection;
