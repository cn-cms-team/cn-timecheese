'use client';

import { useLoading } from '@/components/context/app-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { cn } from '@/lib/utils';
import { ITaskType } from '@/types/setting/task-type';
import { TimelineCardTone } from '@/types/timesheet';
import { TIMELINE_CARD_TONES } from '@/lib/constants/timesheet';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { taskTypeSchema, TaskTypeSchemaType } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskTypeCode } from '../../../../../generated/prisma/enums';
import { Required } from '@/components/ui/custom/form';
import { useEffect } from 'react';

const toneLabels: Record<TimelineCardTone, string> = {
  blue: 'น้ำเงิน',
  violet: 'ม่วง',
  slate: 'เทา',
  green: 'เขียว',
  red: 'แดง',
  yellow: 'เหลือง',
  orange: 'ส้ม',
};

const toneSwatchClasses: Record<TimelineCardTone, string> = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
};

type TaskTypeCreateDialogProps = {
  open: boolean;
  onOpen: (open: boolean) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  taskItem: ITaskType;
  type: TaskTypeCode;
  getData: (type: TaskTypeCode) => void;
};
const TaskTypeCreateDialog = ({
  open = false,
  onOpen,
  size,
  taskItem,
  type,
  getData,
}: TaskTypeCreateDialogProps) => {
  const { isLoading, setIsLoading } = useLoading();

  const sizeClass = size ? `sm:max-w-${size}` : 'sm:max-w-md';

  const form = useForm<TaskTypeSchemaType>({
    resolver: zodResolver(taskTypeSchema),
    defaultValues: {
      ...taskItem,
      tone_color: taskItem.tone_color ?? 'slate',
    },
  });

  useEffect(() => {
    form.reset({
      ...taskItem,
      tone_color: taskItem.tone_color ?? 'slate',
    });
  }, [taskItem]);

  const onSubmit = async (values: TaskTypeSchemaType) => {
    try {
      setIsLoading(true);
      let data;
      let fetchUrl = '/api/v1/setting/task-type';
      if (taskItem.id) {
        fetchUrl = `/api/v1/setting/task-type/${type}`;
        data = {
          id: taskItem.id,
          name: values.name,
          description: values.description,
          type,
          tone_color: values.tone_color,
          is_active: values.is_active,
        };
      } else {
        data = {
          name: values.name,
          description: values.description,
          type,
          tone_color: values.tone_color,
          is_active: values.is_active,
        };
      }
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        await getData(type);
        onOpen(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className={cn(sizeClass)}>
        <DialogHeader>
          <DialogTitle>{taskItem.id ? 'แก้ไขประเภทงาน' : 'เพิ่มประเภทงาน'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="task-type-create-dialog-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ชื่อ
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={MAX_LENGTH_100} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>คำอธิบาย</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      maxLength={MAX_LENGTH_255}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tone_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    สี
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIMELINE_CARD_TONES.map((tone) => (
                        <Button
                          key={tone}
                          type="button"
                          variant="outline"
                          className={cn(
                            'justify-start gap-2 bg-white',
                            field.value === tone && 'border-primary ring-1 ring-primary'
                          )}
                          onClick={() => field.onChange(tone)}
                        >
                          <span className={cn('size-3 rounded-full', toneSwatchClasses[tone])} />
                          {toneLabels[tone]}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        id="is-active"
                      />
                      <Label htmlFor="is-active" className="mb-0">
                        {getIsActive(field.value as boolean)}
                      </Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-transparent"
              disabled={isLoading}
              onClick={() => onOpen(false)}
            >
              ยกเลิก
            </Button>
          </DialogClose>
          <Button type="submit" form="task-type-create-dialog-form" disabled={isLoading}>
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TaskTypeCreateDialog;
