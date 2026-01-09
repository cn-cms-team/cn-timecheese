'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { PERIODCALENDAR } from '@/lib/constants/period-calendar';

import { Button } from '@/components/ui/button';
import TimeSheetColorLegend from './timesheet-color-legend';
import { useTimeSheetContext } from '../view/timesheet-context';
import PeriodInput from '@/components/ui/custom/input/period-input';

const options = [
  { label: 'สัปดาห์', value: PERIODCALENDAR.WEEK },
  { label: 'เดือน', value: PERIODCALENDAR.MONTH },
];

const TimeSheetPeriodSelection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodParam = searchParams.get('period');

  const {
    period,
    setPeriod,
    resetSelectCaledar,
    getTask,
    setWeekAnchorDate,
    setSelectedCalendar,
    setSelectedMonth,
    setSelectedYear,
  } = useTimeSheetContext();

  const onSelectPeriod = (period: PERIODCALENDAR) => {
    setPeriod(period);
    resetSelectCaledar();
    getTask();
    router.replace(`/timesheet?period=${period}`);
  };

  const handleToday = () => {
    const today = new Date();
    setWeekAnchorDate(today);
    setSelectedCalendar(today);
    setSelectedMonth(today);
    setSelectedYear(today.getFullYear());
  };

  useEffect(() => {
    if (periodParam && periodParam !== null) {
      router.replace(`/timesheet?period=${periodParam}`);
      setPeriod(periodParam as PERIODCALENDAR);
    } else {
      router.replace(`/timesheet?period=${PERIODCALENDAR.WEEK}`);
    }
  }, []);
  return (
    <div className="p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] z-50 bg-white">
      <div className=" flex lg:flex-row flex-col gap-4 justify-between">
        <div className="w-full flex gap-2 items-center">
          <PeriodInput
            value={period}
            options={options}
            onSelect={(value) => onSelectPeriod(value as PERIODCALENDAR)}
          />
          <Button
            onClick={handleToday}
            className=" max-w-sm bg-black text-white hover:bg-neutral-600"
          >
            วันนี้
          </Button>
        </div>
        <TimeSheetColorLegend />
      </div>
    </div>
  );
};

export default TimeSheetPeriodSelection;
