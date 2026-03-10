'use client';

import { buddhistFormatDate } from '@/lib/functions/date-format';
import { ITimeSheetResponse } from '@/types/timesheet';
import { CircleUserRound, Pencil, TextAlignStart, Timer, Trash2, X } from 'lucide-react';
import { useTimeSheetContext } from './view/timesheet-context';
import useDialogConfirm from '@/hooks/use-dialog-confirm';
import TimeSheetPopover from './timesheet-popover';

interface IProps {
  data: ITimeSheetResponse;
  close: () => void;
  setIsPopoverEdit: (value: boolean) => void;
}

const TimeSheetdataDetail = ({ data, close, setIsPopoverEdit }: IProps) => {
  const { deleteTask } = useTimeSheetContext();
  const [getConfirmation, Confirmation] = useDialogConfirm();

  const onDeleteTask = async (task: ITimeSheetResponse) => {
    const isConfirmed = await getConfirmation({
      title: 'ลบรายการงาน',
      message: `คุณต้องการลบ "${task.task_type_name}" ใช่หรือไม่?`,
    });

    if (isConfirmed) {
      await deleteTask(task.id);
      close();
    }
  };

  return (
    <div className="grid grid-cols-1 p-4 max-w-[400px] overflow-hidden">
      <header className="flex items-center justify-between w-full gap-2 mb-3">
        <div className="text-xs text-gray-700">
          {new Date(data.stamp_date).toLocaleDateString('th-TH', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer pe-0 focus:border-none"
            onClick={() => setIsPopoverEdit(true)}
          >
            <Pencil className=" text-gray-400" strokeWidth={2} width={16} />
          </button>
          <button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer pe-0 focus:border-none"
            onClick={() => onDeleteTask(data)}
          >
            <Trash2 className=" text-gray-400" strokeWidth={2} width={16} />
          </button>
          <button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer p-0 focus:border-none"
            onClick={() => {
              close();
              setIsPopoverEdit(false);
            }}
          >
            <X className=" text-gray-400" strokeWidth={2} width={16} />
          </button>
        </div>
      </header>
      <main className="grid grid-cols-1 space-y-3">
        <div className="mb-3">
          <TimeSheetPopover
            triggerContent={
              <h3 className="font-semibold max-w-56 line-clamp-2 cursor-pointer border-b border-gray-100 pb-1">
                {data.project_name}
              </h3>
            }
            popoverContent={() => <>{data.project_name}</>}
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Timer width={16} height={16} className="text-gray-400" />
          <span className="text-neutral-700">
            {buddhistFormatDate(data.start_date, 'HH:ii น.')}
          </span>
          {' - '}
          <span className="text-neutral-700">{buddhistFormatDate(data.end_date, 'HH:ii น.')}</span>
        </div>
        <p className="text-xs text-neutral-700 flex items-center gap-2">
          <CircleUserRound width={16} height={16} className="text-gray-400" />
          {data.task_type_name}
        </p>
        <div className="text-xs flex flex-col">
          <span className="text-neutral-700 flex items-center gap-2">
            <TextAlignStart width={16} height={16} className="text-gray-400" />
            รายละเอียดการทำงาน:
          </span>
          <p className="text-xs text-neutral-700 whitespace-pre-wrap text-wrap w-full ps-6">
            {data.detail || '-'}
          </p>
        </div>
      </main>
      <Confirmation />
    </div>
  );
};

export default TimeSheetdataDetail;
