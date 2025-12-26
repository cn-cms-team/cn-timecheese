'use client';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { buddhistFormatDate } from '@/lib/functions/date-format';
import { ITimeSheetRequest, ITimeSheetResponse } from '@/types/timesheet';
import { TimesheetCreateEditSchema, timesheetCreateEditSchema } from './schema';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { useTimeSheetContext } from './view/timesheet-context';
import TimeInput from '@/components/ui/custom/input/time-input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

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
  const { projectOptions, taskTypeOptions, getTask, fetchTaskOption } = useTimeSheetContext();

  const selectedDate = startTime
    ? startTime
    : data?.start_date
    ? new Date(data.start_date)
    : undefined;

  const dayNameTH = selectedDate?.toLocaleDateString('th-TH', {
    weekday: 'long',
  });

  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const baseUrl = `${prefix}/api/v1`;

  const form = useForm({
    resolver: zodResolver(timesheetCreateEditSchema),
    defaultValues: {
      id: data ? data.id : undefined,
      project_task_type_id: data ? data.project_task_type_id : undefined,
      project_id: data ? data.project_id : undefined,
      is_include_breaking_time: data && data.exclude_seconds ? true : false,
      exclude: data && data.exclude_seconds ? data.exclude_seconds : 3600,
      stamp_date: data && data?.stamp_date ? new Date(data?.stamp_date) : new Date(),
      start_date: data && data.start_date ? new Date(data.start_date) : startTime,
      end_date: data && data.end_date ? new Date(data.end_date) : endTime,
      detail: data ? data?.detail : '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const projectId = useWatch({
    control: form.control,
    name: 'project_id',
  });

  const onSubmit = async (value: TimesheetCreateEditSchema) => {
    try {
      const taskId = data ? data.id : null;
      const url = `${baseUrl}/timesheet${taskId ? `/${taskId}` : ''}`;

      const start = new Date(value.start_date);
      const end = new Date(value.end_date);

      end.setFullYear(start.getFullYear());
      end.setMonth(start.getMonth());
      end.setDate(start.getDate());

      const params: ITimeSheetRequest = {
        id: taskId ?? undefined,
        project_id: value.project_id!,
        stamp_date: new Date(value.start_date).toISOString(),
        start_date: new Date(start).toISOString(),
        end_date: new Date(end).toISOString(),
        exclude_seconds: value.is_include_breaking_time ? value.exclude ?? 0 : null,
        project_task_type_id: value?.project_task_type_id!,
        detail: value.detail,
      };

      const response = await fetch(url, {
        method: taskId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: params }),
      });

      if (response.ok) {
        const result = await response.json();
        toast(result.message);
        await getTask();
        close();
      }
    } catch (error) {
      console.error('Error fetching options: ', error);
    }
  };

  const calculateHour = () => {
    const startDate = useWatch({ control: form.control, name: 'start_date' });
    const endDate = useWatch({ control: form.control, name: 'end_date' });
    const exclude = useWatch({ control: form.control, name: 'exclude' }) || 0;
    const isIncludeBreak = useWatch({
      control: form.control,
      name: 'is_include_breaking_time',
    });

    if (!startDate || !endDate) return '0.00';

    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setFullYear(start.getFullYear());
    end.setMonth(start.getMonth());
    end.setDate(start.getDate());

    let totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

    if (totalSeconds <= 0) return '0.00';

    if (!isIncludeBreak) {
      return (totalSeconds / 3600).toFixed(2);
    }

    totalSeconds = totalSeconds - exclude;

    return (totalSeconds / 3600).toFixed(2);
  };

  const timeToSeconds = (time: string) => {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 3600 + mm * 60;
  };

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <main className="w-full space-y-4">
        <Form {...form}>
          <form
            id="timesheet-create-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 space-y-4 max-w-80"
          >
            <div className="flex items-center w-full">
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem className="px-0 w-full ">
                    <FormControl>
                      <ComboboxForm
                        field={field}
                        placeholder="เลือกโปรเจค"
                        options={projectOptions}
                        onSelect={(value) => {
                          field.onChange(value);
                          fetchTaskOption(value);
                          form.resetField('project_task_type_id');
                        }}
                        isError={form.formState.errors.project_id ? true : false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between px-0">
              <div className="flex items-center px-0">
                <Calendar width={25} strokeWidth={1} />
                <span className="ml-2 font-semibold text-sm">{`${dayNameTH} ${buddhistFormatDate(
                  data ? data.start_date : startTime,
                  'dd mmmm yyyy'
                )}`}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2 w-full">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="px-0">
                    <FormControl>
                      <TimeInput
                        value={field.value ? buddhistFormatDate(field.value, 'HH:ii') : ''}
                        type="time"
                        className="w-full"
                        onChange={(e) => {
                          const time = e.target.value;
                          if (!time) return;

                          const [hh, mm] = time.split(':').map(Number);

                          const base = field.value ?? new Date();
                          const nextStart = new Date(base);
                          nextStart.setHours(hh, mm, 0, 0);

                          field.onChange(nextStart);
                        }}
                        isError={form.formState.errors.start_date ? true : false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="px-0">
                    <FormControl className="ms-0 me-0">
                      <TimeInput
                        type="time"
                        className="mx-2 w-full"
                        value={field.value ? buddhistFormatDate(field.value, 'HH:ii') : ''}
                        onChange={(e) => {
                          const time = e.target.value;
                          if (!time) return;

                          const [hh, mm] = time.split(':').map(Number);

                          const base = field.value ?? new Date();
                          const nextStart = new Date(base);
                          nextStart.setHours(hh, mm, 0, 0);

                          field.onChange(nextStart);
                        }}
                        isError={form.formState.errors.end_date ? true : false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2 justify-center items-center">
                <FormField
                  control={form.control}
                  name="is_include_breaking_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value}
                            id="exclude"
                            className="cursor-pointer"
                            onCheckedChange={(checked) => {
                              field.onChange(Boolean(checked));

                              if (!checked) {
                                form.setValue('exclude', 3600);
                              }
                            }}
                          />
                          <Label htmlFor="exclude" className="pb-1 cursor-pointer">
                            รวมเวลาพักกลางวัน
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="exclude"
                render={({ field }) => (
                  <FormItem className="px-0">
                    <FormControl>
                      <TimeInput
                        value={
                          typeof field.value === 'number'
                            ? new Date(field.value * 1000).toISOString().substring(11, 16)
                            : ''
                        }
                        disabled={!form.getValues('is_include_breaking_time')}
                        onChange={(e) => {
                          const time = e.target.value;
                          if (!time) return;

                          const seconds = timeToSeconds(time);
                          field.onChange(seconds);
                        }}
                        isError={form.formState.errors.exclude ? true : false}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="project_task_type_id"
              render={({ field }) => (
                <FormItem className="px-0">
                  <FormControl>
                    <ComboboxForm
                      field={field}
                      isGroup
                      placeholder="เลือกประเภทงาน"
                      options={taskTypeOptions}
                      onSelect={field.onChange}
                      disabled={!projectId}
                      isError={form.formState.errors.project_task_type_id ? true : false}
                    />
                  </FormControl>
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
                      maxLength={500}
                      onChange={(value) => field.onChange(value)}
                      isError={form.formState.errors.detail ? true : false}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <footer className="grid grid-cols-1 space-y-2">
              {Object.values(form.formState.errors) && (
                <ul className="list-disc pl-5">
                  {Object.values(form.formState.errors).map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      {error?.message}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <Button
                  className="w-40 bg-transparent border-neutral-500 text-black hover:bg-neutral-200 cursor-pointer"
                  type="button"
                  onClick={close}
                >
                  ยกเลิก
                </Button>
                <Button className="w-40  cursor-pointer text-black" type="submit">
                  บันทึก ({calculateHour()} ชม)
                </Button>
              </div>
            </footer>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default TimeSheetForm;
