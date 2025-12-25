'use client';

import { buddhistFormatDate } from '@/lib/functions/date-format';
import { ITimeSheetResponse } from '@/types/timesheet';

interface IProps {
  data?: ITimeSheetResponse;
}

const TimeSheetEventCard = ({ data }: IProps) => {
  if (!data) return null;

  return (
    <div className="w-full h-full border px-3 py-2 rounded-lg bg-primary shadow-lg cursor-pointer overflow-hidden flex justify-between flex-col ">
      <header>
        <span className="truncate font-bold text-base">{data.task_type_name}</span>
        <div className="text-xs font-semibold truncate">
          {buddhistFormatDate(data.start_date, 'HH:ii')} -{' '}
          {buddhistFormatDate(data.end_date, 'HH:ii')}
        </div>
      </header>
      <footer>
        <p className="text-xs truncate">{data.project_name}</p>
      </footer>
    </div>
  );
};

export default TimeSheetEventCard;
