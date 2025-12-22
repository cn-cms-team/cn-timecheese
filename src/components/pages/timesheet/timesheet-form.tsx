'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { Calendar, Clock, X } from 'lucide-react';

interface IProps {
  close?: () => void;
}

const TimeSheetForm = ({ close = () => {} }: IProps) => {
  const now = new Date();
  const dayNameTH = now.toLocaleDateString('th-TH', {
    weekday: 'long',
  });

  return (
    <div className="grid grid-cols-1 p-3 w-full">
      <header className="w-full text-end">
        <Button
          className="bg-transparent border-transparent hover:bg-transparent cursor-pointer p-2 focus:border-none"
          onClick={close}
        >
          <X width={14} stroke="#000" />
        </Button>
      </header>
      <main className="w-full space-y-4">
        <div className="w-full">
          <Input placeholder="ชื่อ Task" />
        </div>
        <div className="flex items-center">
          <Calendar width={25} strokeWidth={1} />
          <span className="ml-2 font-semibold">{`${dayNameTH} ${buddhistFormatDate(
            now,
            'dd mmmm yyyy'
          )}`}</span>
        </div>
        <div className="flex items-center">
          <Clock width={25} strokeWidth={1} />
          <Input
            type="time"
            className="mx-2 w-40"
            defaultValue={buddhistFormatDate(now, 'HH:ii')}
          />
          <Input type="time" className="w-40" defaultValue={buddhistFormatDate(now, 'HH:ii')} />
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <span>รายละเอียด</span>
          <Textarea placeholder="อธิบายการทำงาน" className="h-30" />
        </div>
      </main>
      <footer className="mt-4 space-x-2">
        <Button
          className="w-40 bg-transparent border-neutral-500 text-black hover:bg-neutral-200 cursor-pointer"
          onClick={close}
        >
          ยกเลิก
        </Button>
        <Button className="w-40 mt-4 cursor-pointer text-black">บันทึก</Button>
      </footer>
    </div>
  );
};

export default TimeSheetForm;
