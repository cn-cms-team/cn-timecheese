'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { PERIOD_CALENDAR } from '@/lib/constants/period-calendar';

import { Button } from '@/components/ui/button';
import TimeSheetColorLegend from './timesheet-color-legend';
import { useTimeSheetContext } from '../view/timesheet-context';
import PeriodInput from '@/components/ui/custom/input/period-input';

const options = [
  { label: 'สัปดาห์', value: PERIOD_CALENDAR.WEEK },
  { label: 'เดือน', value: PERIOD_CALENDAR.MONTH },
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

  const onSelectPeriod = (period: PERIOD_CALENDAR) => {
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
      setPeriod(periodParam as PERIOD_CALENDAR);
    } else {
      router.replace(`/timesheet?period=${PERIOD_CALENDAR.WEEK}`);
    }
  }, []);
  return (
    <div className="p-4 z-50 bg-white">
      <div className=" flex lg:flex-row flex-col gap-4 justify-between">
        <div className="w-full flex gap-2 items-center">
          <PeriodInput
            value={period}
            options={options}
            onSelect={(value) => onSelectPeriod(value as PERIOD_CALENDAR)}
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
