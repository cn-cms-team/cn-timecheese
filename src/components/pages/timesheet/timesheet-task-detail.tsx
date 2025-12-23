'use client';

import { Button } from '@/components/ui/button';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { ITimeSheetResponse } from '@/types/timesheet';
import { SquarePen, X } from 'lucide-react';

interface IProps {
  data: ITimeSheetResponse;
  close: () => void;
  setIsPopoverEdit: (value: boolean) => void;
}

const TimeSheetdataDetail = ({ data, close, setIsPopoverEdit }: IProps) => {
  return (
    <div className="grid grid-cols-1 p-4">
      <header className="flex items-center justify-between">
        <div className="truncate">
          <h3 className="font-bold text-lg">{data.project_name}</h3>
        </div>
        <div className="flex items-center">
          <Button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer p-2 focus:border-none float-right"
            onClick={() => setIsPopoverEdit(true)}
          >
            <SquarePen stroke="#000" strokeWidth={2} />
          </Button>
          <Button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer p-2 focus:border-none float-right"
            onClick={() => {
              close();
              setIsPopoverEdit(false);
            }}
          >
            <X stroke="#000" strokeWidth={2} />
          </Button>
        </div>
      </header>
      <main>
        <p>{data.task_type_name}</p>
        <div className="text-sm">
          <span>{buddhistFormatDate(data.start_date, 'HH:ii น.')}</span>
          {' - '}
          <span>{buddhistFormatDate(data.end_date, 'HH:ii น.')}</span>
        </div>
        <div className="text-sm">
          <p className="text-sm text-black whitespace-pre-wrap">{data.detail}</p>
        </div>
      </main>
    </div>
  );
};

export default TimeSheetdataDetail;
