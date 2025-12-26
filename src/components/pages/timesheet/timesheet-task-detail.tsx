'use client';

import { buddhistFormatDate } from '@/lib/functions/date-format';
import { ITimeSheetResponse } from '@/types/timesheet';
import { Pencil, Trash2, X } from 'lucide-react';
import { useTimeSheetContext } from './view/timesheet-context';
import useDialogConfirm from '@/hooks/use-dialog-confirm';

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
    <div className="grid grid-cols-1 p-4 max-w-[320px]">
      <header className="flex items-center justify-between w-full gap-2">
        <div>
          <h3 className="font-bold truncate">{data.project_name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer pe-0 focus:border-none"
            onClick={() => setIsPopoverEdit(true)}
          >
            <Pencil stroke="#000" strokeWidth={2} width={16} />
          </button>
          <button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer pe-0 focus:border-none"
            onClick={() => onDeleteTask(data)}
          >
            <Trash2 stroke="#ff0000" strokeWidth={2} width={16} />
          </button>
          <button
            className="bg-transparent border-transparent hover:bg-transparent cursor-pointer p-0 focus:border-none"
            onClick={() => {
              close();
              setIsPopoverEdit(false);
            }}
          >
            <X stroke="#000" strokeWidth={2} width={16} />
          </button>
        </div>
      </header>
      <main className="grid grid-cols-1">
        <p>{data.task_type_name}</p>
        <div className="text-sm">
          <span>{buddhistFormatDate(data.start_date, 'HH:ii น.')}</span>
          {' - '}
          <span>{buddhistFormatDate(data.end_date, 'HH:ii น.')}</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">รายละเอียดการทำงาน</span>
          <p className="text-sm text-neutral-800 whitespace-pre-wrap text-wrap w-full ps-1">
            {data.detail || '-'}
          </p>
        </div>
      </main>
      <Confirmation />
    </div>
  );
};

export default TimeSheetdataDetail;
