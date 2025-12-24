'use client';

import { buddhistFormatDate } from '@/lib/functions/date-format';
import { ITimeSheetResponse } from '@/types/timesheet';

interface IProps {
  data?: ITimeSheetResponse;
  height: number;
}

const TimeSheetEventCard = ({ data, height }: IProps) => {
  if (!data) return null;

  return (
    <div className="w-full h-full border px-3 py-2 rounded-lg bg-primary shadow-lg cursor-pointer overflow-hidden flex justify-between flex-col ">
      <header className="truncate font-bold text-sm">
        {data.task_type_name}
        <div className="text-[11px] font-semibold truncate">
          {buddhistFormatDate(data.start_date, 'HH:ii')} -{' '}
          {buddhistFormatDate(data.end_date, 'HH:ii')}
        </div>
      </header>
      <footer>
        <p className="text-xs truncate">{data.project_name}</p>
      </footer>
      {/* {height >= 90 && <p className="mt-1 text-xs truncate">{data.detail}</p>} */}
    </div>
  );
};

export default TimeSheetEventCard;
