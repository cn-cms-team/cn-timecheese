'use client';

import { Button } from '@/components/ui/button';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { timesheetCreateEditSchema } from './schema';
import { ITimeSheetResponse } from '@/types/timesheet';

interface IProps {
  close?: () => void;
  data?: Partial<ITimeSheetResponse>;
  startTime?: Date;
  endTime?: Date;
}

const TimeSheetForm = ({
  data = undefined,
  startTime = undefined,
  endTime = undefined,
  close = () => {},
}: IProps) => {
  const selectedDate = startTime
    ? startTime
    : data?.start_date
    ? new Date(data.start_date)
    : undefined;
  const dayNameTH = selectedDate?.toLocaleDateString('th-TH', {
    weekday: 'long',
  });

  const form = useForm({
    resolver: zodResolver(timesheetCreateEditSchema),
    defaultValues: {
      task_type_id: data ? data.task_type_id : undefined,
      start_date: data && data.start_date ? new Date(data.start_date) : startTime,
      end_date: data && data.end_date ? new Date(data.end_date) : endTime,
      detail: data ? data?.detail : '',
      remark: data ? data.remark : '',
    },
  });

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <main className="w-full space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data);
            })}
            className="grid grid-cols-1 space-y-4 w-full"
          >
            <div className="flex items-center">
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem className="px-0 w-full">
                    <FormControl>
                      <ComboboxForm
                        field={field}
                        placeholder="เลือกประโปรเจค"
                        options={[]}
                        onSelect={() => {}}
                        isError={form.formState.errors.task_type_id ? true : false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" text-end">
                <Button
                  className="bg-transparent border-transparent focus-visible:hidden hover:bg-transparent cursor-pointer focus:border-none"
                  type="button"
                  onClick={close}
                >
                  <X width={14} stroke="#000" />
                </Button>
              </div>
            </div>
            <div className="flex items-center px-0">
              <Calendar width={25} strokeWidth={1} />
              <span className="ml-2 font-semibold">{`${dayNameTH} ${buddhistFormatDate(
                data ? data.start_date : startTime,
                'dd mmmm yyyy'
              )}`}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="px-0">
                    <FormControl>
                      <Input
                        value={field.value ? buddhistFormatDate(field.value, 'HH:ii') : ''}
                        type="time"
                        className="w-full"
                        onChange={(e) => {
                          const time = e.target.value;
                          if (!time) return;

                          const [hh, mm] = time.split(':').map(Number);

                          const date = field.value ? new Date(field.value) : new Date();
                          date.setHours(hh, mm, 0, 0);

                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="px-0">
                    <FormControl className="ms-0 me-0">
                      <Input
                        type="time"
                        className="mx-2 w-full"
                        value={field.value ? buddhistFormatDate(field.value, 'HH:ii') : ''}
                        onChange={(e) => {
                          const time = e.target.value;
                          if (!time) return;

                          const [hh, mm] = time.split(':').map(Number);

                          const date = field.value ? new Date(field.value) : new Date();
                          date.setHours(hh, mm, 0, 0);

                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="task_type_id"
              render={({ field }) => (
                <FormItem className="px-0">
                  <FormControl>
                    <ComboboxForm
                      field={field}
                      placeholder="เลือกประเภทงาน"
                      options={[]}
                      onSelect={() => {}}
                      isError={form.formState.errors.task_type_id ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem className="px-0">
                  <FormControl>
                    <Textarea
                      value={field.value}
                      placeholder="กรอกรายละเอียดการทำงาน"
                      onChange={(value) => field.onChange(value)}
                      // isError={form.formState.errors.detail ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="px-0">
                  <FormControl>
                    <Textarea
                      value={field.value}
                      placeholder="กรอกหมายเหตุ"
                      onChange={(value) => field.onChange(value)}
                      // isError={form.formState.errors.detail ? true : false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <footer className="flex justify-center items-center mt-4 space-x-2">
              <Button
                className="w-40 bg-transparent border-neutral-500 text-black hover:bg-neutral-200 cursor-pointer"
                type="button"
                onClick={close}
              >
                ยกเลิก
              </Button>
              <Button className="w-40  cursor-pointer text-black" type="submit">
                บันทึก
              </Button>
            </footer>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default TimeSheetForm;
