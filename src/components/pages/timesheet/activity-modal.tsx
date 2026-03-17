'use client';

import { useEffect, useMemo, useState } from 'react';
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
import {
  Form,
  FormControl,
  FormField,
  FormGroup,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import TimeInput from '@/components/ui/custom/input/time-input';
import { parseDayId } from '@/lib/functions/timesheet-manage';
import { TimeSheetCreateEditSchema, timeSheetCreateEditSchema } from './schema';
import { useTimeSheetMasterContext } from './view/timesheet-master-context';
import { Required } from '@/components/ui/custom/form';
import { toast } from 'sonner';
import { handleAddTimeSheet, handleEditTimeSheet } from './actions';
import { getThaiDateString } from '@/lib/functions/date-format';
import type { TimelineItem } from '@/types/timesheet';

interface AddActivityModalProps {
  selectedDayId: string;
  open: boolean;
  initialItem?: TimelineItem | null;
  latestActivityEndDate?: Date | null;
  onOpenChange: (open: boolean) => void;
  onSaved?: (hourData: Record<string, number>, dayId: string) => void;
}

const START_TIME_HOUR = 9;
const END_TIME_HOUR = 18;
const DEFAULT_END_TIME_HOUR = 10;

const AddActivityModal = ({
  selectedDayId,
  open,
  initialItem,
  latestActivityEndDate,
  onOpenChange,
  onSaved,
}: AddActivityModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isProjectOptionsLoading, projectOptions, getTaskTypeOptionsByProjectId } =
    useTimeSheetMasterContext();

  const selectedDate = useMemo(() => parseDayId(selectedDayId), [selectedDayId]);

  const normalizedSelectedDate = useMemo(() => {
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [selectedDate]);

  const defaultStartDate = useMemo(() => {
    const start = new Date(selectedDate);

    if (latestActivityEndDate) {
      start.setHours(
        latestActivityEndDate.getHours(),
        latestActivityEndDate.getMinutes(),
        latestActivityEndDate.getSeconds(),
        latestActivityEndDate.getMilliseconds()
      );

      return start;
    }

    start.setHours(START_TIME_HOUR, 0, 0, 0);
    return start;
  }, [latestActivityEndDate, selectedDate]);

  const defaultEndDate = useMemo(() => {
    const end = new Date(defaultStartDate);

    if (latestActivityEndDate) {
      end.setHours(end.getHours() + 1);
      return end;
    }

    end.setHours(DEFAULT_END_TIME_HOUR, 0, 0, 0);
    return end;
  }, [defaultStartDate, latestActivityEndDate]);

  const defaultBreakTime = useMemo(() => {
    const breakTime = new Date(selectedDate);
    breakTime.setHours(1, 0, 0, 0);
    return breakTime;
  }, [selectedDate]);

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
      is_all_day:
        defaultStartDate.getHours() === START_TIME_HOUR &&
        defaultEndDate.getHours() === END_TIME_HOUR,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const id = form.watch('id');
  const projectId = form.watch('project_id');
  const projectTaskTypeId = form.watch('project_task_type_id');
  const startDate = form.watch('start_date');
  const endDate = form.watch('end_date');
  const includeBreakTime = form.watch('is_include_breaking_time');
  const breakTime = form.watch('break_time') || defaultBreakTime;

  useEffect(() => {
    const excludeSeconds = includeBreakTime
      ? breakTime.getHours() * 3600 + breakTime.getMinutes() * 60
      : 0;

    if (form.getValues('exclude') !== excludeSeconds) {
      form.setValue('exclude', excludeSeconds, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [breakTime, form, includeBreakTime]);

  const taskTypeOptions = useMemo(
    () => getTaskTypeOptionsByProjectId(projectId),
    [getTaskTypeOptionsByProjectId, projectId]
  );

  const filteredProjectOptions = useMemo(() => {
    return projectOptions
      .map((group) => ({
        ...group,
        options: group.options.filter((project) => {
          const projectStartDate = project.startDate ? new Date(project.startDate) : null;
          const projectEndDate = project.endDate ? new Date(project.endDate) : null;

          if (projectStartDate) {
            projectStartDate.setHours(0, 0, 0, 0);
            if (normalizedSelectedDate < projectStartDate) {
              return false;
            }
          }

          if (projectEndDate) {
            projectEndDate.setHours(23, 59, 59, 999);
            if (normalizedSelectedDate > projectEndDate) {
              return false;
            }
          }

          return true;
        }),
      }))
      .filter((group) => group.options.length > 0);
  }, [normalizedSelectedDate, projectOptions]);

  const isEditMode = Boolean(initialItem?.id);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialItem) {
      const startDate = new Date(initialItem.start_date);
      const endDate = new Date(initialItem.end_date);
      const breakDate = new Date(parseDayId(initialItem.stamp_date));
      const hasBreakTime = initialItem.exclude_seconds > 0;

      if (hasBreakTime) {
        breakDate.setHours(
          Math.floor(initialItem.exclude_seconds / 3600),
          Math.floor((initialItem.exclude_seconds % 3600) / 60),
          0,
          0
        );
      } else {
        breakDate.setHours(1, 0, 0, 0);
      }

      form.reset({
        id: initialItem.id,
        project_task_type_id: initialItem.project_task_type_id,
        project_id: initialItem.project_id,
        is_include_breaking_time: hasBreakTime,
        exclude: initialItem.exclude_seconds,
        stamp_date: parseDayId(initialItem.stamp_date),
        start_date: startDate,
        end_date: endDate,
        detail: initialItem.detail,
        break_time: breakDate,
        is_all_day:
          startDate.getHours() === START_TIME_HOUR && endDate.getHours() === END_TIME_HOUR,
      });

      return;
    }

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
  }, [defaultBreakTime, defaultEndDate, defaultStartDate, form, initialItem, open, selectedDate]);

  useEffect(() => {
    if (!projectTaskTypeId) {
      return;
    }

    const isValidTaskType = taskTypeOptions.some((group) =>
      group.options.some((taskType) => taskType.value === projectTaskTypeId)
    );

    if (!isValidTaskType) {
      form.setValue('project_task_type_id', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [form, projectTaskTypeId, taskTypeOptions]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const isValidProject = filteredProjectOptions.some((group) =>
      group.options.some((project) => project.value === projectId)
    );

    if (!isValidProject) {
      form.setValue('project_id', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue('project_task_type_id', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [filteredProjectOptions, form, projectId]);

  const selectedDateLabel = useMemo(() => {
    return selectedDate.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedDate]);

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

  const handleSubmitAddActivity = async (values: TimeSheetCreateEditSchema) => {
    try {
      setIsLoading(true);

      values.exclude = values.is_include_breaking_time
        ? breakTime.getHours() * 3600 + breakTime.getMinutes() * 60
        : 0;
      values.stamp_date_string = getThaiDateString(values.stamp_date);

      const result = id ? await handleEditTimeSheet(id, values) : await handleAddTimeSheet(values);
      if (result?.message) {
        if (result.success) {
          toast.success(result.message);
        } else {
          if (result.code === 'DUPLICATED_CODE') {
            toast.warning(result.message);
          } else {
            toast.error(result.message);
          }
        }
      }
      if (result?.success) {
        const savedHourData = (result as { hourData?: Record<string, number> }).hourData ?? {};
        onSaved?.(savedHourData, selectedDayId);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('OnSubmit Error:', error);
      toast('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllDayChange = (checked: boolean) => {
    form.setValue('is_all_day', checked, {
      shouldDirty: true,
      shouldValidate: true,
    });

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
      <DialogContent className="sm:max-w-md p-0" showCloseButton={false}>
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditMode ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรม'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 px-4 pb-4 min-w-0"
            onSubmit={form.handleSubmit(handleSubmitAddActivity)}
          >
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
                          disabled={isLoading}
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
                      <TimeInput
                        onChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                        isModal
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
                  <FormItem>
                    <FormControl>
                      <TimeInput
                        onChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                        isModal
                      />
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
                          disabled={isLoading}
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
                        disabled={!includeBreakTime || isLoading}
                        onChange={field.onChange}
                        value={field.value || defaultBreakTime}
                        isModal
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormGroup>
                    <FormLabel>
                      โครงการ
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <ComboboxForm
                        disabled={isProjectOptionsLoading || isLoading}
                        field={field}
                        options={filteredProjectOptions}
                        placeholder="เลือกโครงการ"
                        value={projectId}
                        isGroup
                        isModal
                        isError={Boolean(form.formState.errors.project_id)}
                        onSelect={(value) => {
                          field.onChange(value);
                          form.setValue('project_task_type_id', undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      />
                    </FormControl>
                  </FormGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="project_task_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormGroup>
                    <FormLabel>
                      ประเภทงาน
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <ComboboxForm
                        disabled={!projectId || isLoading}
                        field={field}
                        options={taskTypeOptions}
                        placeholder="เลือกประเภทงาน"
                        isGroup
                        isModal
                        isError={Boolean(form.formState.errors.project_task_type_id)}
                        onSelect={(value) => {
                          form.setValue('project_task_type_id', value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          form.clearErrors('project_task_type_id');
                        }}
                      />
                    </FormControl>
                  </FormGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormGroup>
                    <FormLabel>
                      รายละเอียดการทำงาน
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-20 rounded-lg border-slate-200 px-3 py-2 text-base"
                        isError={Boolean(form.formState.errors.detail)}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder="กรอกรายละเอียดการทำงาน"
                        value={field.value}
                        disabled={isLoading}
                        maxLength={1000}
                      />
                    </FormControl>
                  </FormGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.exclude && (
              <div className="text-red-500 text-sm">{form.formState.errors.exclude.message}</div>
            )}
            <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <Button
                variant={'outline'}
                onClick={() => onOpenChange(false)}
                type="button"
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isLoading}>
                บันทึก ({formattedCalculatedHours} ชม)
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
