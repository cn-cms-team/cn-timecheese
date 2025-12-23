'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { PERIODCALENDAR } from '@/lib/constants/period-calendar';

import TimeSheetColorLegend from './timesheet-color-legend';
import { useTimeSheetContext } from './view/timesheet-context';
import PeriodInput from '@/components/ui/custom/input/period-input';

const options = [
  { label: 'สัปดาห์', value: PERIODCALENDAR.WEEK },
  { label: 'เดือน', value: PERIODCALENDAR.MONTH },
];

const TimeSheetPeriodSelection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodParam = searchParams.get('period');

  const { period, setPeriod, resetSelectCaledar } = useTimeSheetContext();

  const onSelectPeriod = (period: PERIODCALENDAR) => {
    setPeriod(period);
    resetSelectCaledar();
    router.replace(`/timesheet?period=${period}`);
  };

  useEffect(() => {
    if (periodParam && periodParam !== null) {
      router.replace(`/timesheet?period=${periodParam}`);
      setPeriod(Number(periodParam));
    } else {
      router.replace('/timesheet?period=1');
    }
  }, []);
  return (
    <div className="p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] z-50 ">
      <div className=" flex lg:flex-row flex-col gap-4 justify-between">
        <PeriodInput
          value={period}
          options={options}
          onSelect={(value) => onSelectPeriod(value as PERIODCALENDAR)}
        />
        <TimeSheetColorLegend />
      </div>
    </div>
  );
};

export default TimeSheetPeriodSelection;
