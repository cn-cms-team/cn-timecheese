'use client';

import { useEffect, useMemo } from 'react';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import TimeInput from '@/components/ui/custom/input/time-input';
import { parseDayId } from '@/lib/functions/timesheet-manage';
import { TimeSheetCreateEditSchema, timeSheetCreateEditSchema } from './schema';

interface AddActivityModalProps {
  selectedDayId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddActivityModal = ({ selectedDayId, open, onOpenChange }: AddActivityModalProps) => {
  const defaultStartDate = useMemo(() => {
    const selectedDate = parseDayId(selectedDayId);
    const start = new Date(selectedDate);
    start.setHours(9, 0, 0, 0);
    return start;
  }, [selectedDayId]);

  const defaultEndDate = useMemo(() => {
    const selectedDate = parseDayId(selectedDayId);
    const end = new Date(selectedDate);
    end.setHours(10, 0, 0, 0);
    return end;
  }, [selectedDayId]);

  const defaultBreakTime = useMemo(() => {
    const selectedDate = parseDayId(selectedDayId);
    const breakTime = new Date(selectedDate);
    breakTime.setHours(1, 0, 0, 0);
    return breakTime;
  }, [selectedDayId]);

  const form = useForm<TimeSheetCreateEditSchema>({
    resolver: zodResolver(timeSheetCreateEditSchema),
    defaultValues: {
      id: undefined,
      project_task_type_id: undefined,
      project_id: undefined,
      is_include_breaking_time: false,
      exclude: 3600,
      stamp_date: new Date(),
      start_date: defaultStartDate,
      end_date: defaultEndDate,
      detail: '',

      break_time: defaultBreakTime,
      is_all_day: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const projectId = form.watch('project_id');
  const startDate = form.watch('start_date');
  const endDate = form.watch('end_date');
  const includeBreakTime = form.watch('is_include_breaking_time');
  const breakTime = form.watch('break_time') || defaultBreakTime;
  const isAllDay = form.watch('is_all_day');

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedDate = parseDayId(selectedDayId);

    form.reset({
      id: undefined,
      project_task_type_id: undefined,
      project_id: undefined,
      is_include_breaking_time: false,
      exclude: 3600,
      stamp_date: selectedDate,
      start_date: defaultStartDate,
      end_date: defaultEndDate,
      detail: '',
      break_time: defaultBreakTime,
      is_all_day: false,
    });
  }, [open, selectedDayId]);

  const selectedDateLabel = useMemo(() => {
    const selectedDate = parseDayId(selectedDayId);
    return selectedDate.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedDayId]);

  const projectOptions = useMemo(
    () => [
      {
        label: 'โปรเจคภายใน',
        options: [
          { label: 'Project A', value: 'project-a' },
          { label: 'Project B', value: 'project-b' },
        ],
      },
      {
        label: 'โปรเจคภายนอก',
        options: [{ label: 'Project C', value: 'project-c' }],
      },
    ],
    []
  );

  const taskTypeOptions = useMemo(
    () => [
      {
        label: 'งานหลัก',
        options: [
          { label: 'Development', value: 'dev' },
          { label: 'Support', value: 'support' },
        ],
      },
      {
        label: 'งานประสานงาน',
        options: [{ label: 'Meeting', value: 'meeting' }],
      },
    ],
    []
  );

  const formattedCalculatedHours = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setFullYear(start.getFullYear());
    end.setMonth(start.getMonth());
    end.setDate(start.getDate());

    let totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (totalSeconds <= 0) {
      return '0.00';
    }

    if (includeBreakTime) {
      totalSeconds -= breakTime.getHours() * 3600 + breakTime.getMinutes() * 60;
    }

    return (Math.max(totalSeconds, 0) / 3600).toFixed(2);
  }, [breakTime, includeBreakTime, startDate, endDate]);

  const handleSubmitAddActivity = () => {
    onOpenChange(false);
  };

  const handleAllDayChange = (checked: boolean) => {
    form.setValue('is_all_day', checked, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const selectedDate = parseDayId(selectedDayId);
    if (checked) {
      form.setValue('is_include_breaking_time', true, {
        shouldDirty: true,
        shouldValidate: true,
      });

      const fullDayStart = new Date(selectedDate);
      fullDayStart.setHours(9, 0, 0, 0);

      const fullDayEnd = new Date(selectedDate);
      fullDayEnd.setHours(18, 0, 0, 0);

      form.setValue('start_date', fullDayStart, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue('end_date', fullDayEnd, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-110 p-0" showCloseButton={false}>
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-xl font-bold text-slate-900">เพิ่มกิจกรรม</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 px-4 pb-4"
            onSubmit={form.handleSubmit(handleSubmitAddActivity)}
          >
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboboxForm
                      field={field}
                      options={projectOptions}
                      placeholder="เลือกโปรเจค"
                      value={projectId}
                      isGroup
                      isError={Boolean(form.formState.errors.project_id)}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <CalendarIcon className="size-5 text-slate-600" />
                <span>{selectedDateLabel}</span>
              </div>

              <FormField
                control={form.control}
                name="is_all_day"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          id="is-all-day"
                          onCheckedChange={(checked) => handleAllDayChange(Boolean(checked))}
                        />
                        <Label
                          className="cursor-pointer text-lg font-medium text-slate-800"
                          htmlFor="is-all-day"
                        >
                          ทั้งวัน
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TimeInput onChange={field.onChange} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TimeInput onChange={field.onChange} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-3">
              <FormField
                control={form.control}
                name="is_include_breaking_time"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          id="include-break-time"
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        />
                        <Label
                          className="cursor-pointer text-lg font-medium text-slate-800"
                          htmlFor="include-break-time"
                        >
                          รวมเวลาพัก
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="break_time"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TimeInput
                        disabled={!includeBreakTime}
                        onChange={field.onChange}
                        value={field.value || defaultBreakTime}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="project_task_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboboxForm
                      field={field}
                      options={taskTypeOptions}
                      placeholder="เลือกประเภทงาน"
                      isGroup
                      isError={Boolean(form.formState.errors.project_task_type_id)}
                      onSelect={field.onChange}
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
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-20 rounded-lg border-slate-200 px-3 py-2 text-base"
                      isError={Boolean(form.formState.errors.detail)}
                      onChange={(event) => field.onChange(event.target.value)}
                      placeholder="กรอกรายละเอียดการทำงาน"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <Button variant={'outline'} onClick={() => onOpenChange(false)} type="button">
                ยกเลิก
              </Button>
              <Button type="submit">บันทึก ({formattedCalculatedHours} ชม)</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
