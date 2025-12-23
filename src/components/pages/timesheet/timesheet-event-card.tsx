'use client';

import { buddhistFormatDate } from '@/lib/functions/date-format';
import { ITimeSheetResponse } from '@/types/timesheet';

interface IProps {
  data?: ITimeSheetResponse;
  height: number;
}

const TimeSheetEventCard = ({ data = undefined, height }: IProps) => {
  if (!data) return;
  return (
    <div className="w-full min-h-full px-4 py-3 rounded-lg bg-primary shadow-lg cursor-pointer">
      <header>
        <h3 className="font-bold text-lg truncate">{data.project_name}</h3>
        <p className="font-semibold text-wrap overflow-hidden truncate">{data.task_type_name}</p>
      </header>
      <main>
        <div>
          <span>{buddhistFormatDate(data.start_date, 'HH:ii น.')}</span>
          {' - '}
          <span>{buddhistFormatDate(data.end_date, 'HH:ii น.')}</span>
        </div>
        {height >= 100 && (
          <div className="overflow-hidden">
            <p className="text-sm text-neutral-800 truncate">{data.detail}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TimeSheetEventCard;
