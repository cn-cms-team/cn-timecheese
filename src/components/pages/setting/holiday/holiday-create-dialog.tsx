'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useLoading } from '@/components/context/app-context';
import { Required } from '@/components/ui/custom/form';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';
import { createHoliday, updateHoliday } from './action';
import { holidaySchema, HolidaySchemaType } from './schema';

type HolidayDialogItem = {
  id?: string;
  name: string;
  description?: string | null;
  date: Date;
};

type HolidayCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holidayItem?: HolidayDialogItem | null;
  onSubmitted: () => Promise<void>;
};

const toDateOnlyString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const HolidayCreateDialog = ({
  open,
  onOpenChange,
  holidayItem,
  onSubmitted,
}: HolidayCreateDialogProps) => {
  const { isLoading, setIsLoading } = useLoading();

  const form = useForm<HolidaySchemaType>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: holidayItem?.name || '',
      description: holidayItem?.description || '',
      date: holidayItem?.date || new Date(),
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: holidayItem?.name || '',
      description: holidayItem?.description || '',
      date: holidayItem?.date || new Date(),
    });
  }, [form, holidayItem, open]);

  const onSubmit = async (values: HolidaySchemaType) => {
    try {
      setIsLoading(true);
      const payload = {
        name: values.name,
        description: values.description,
        date: toDateOnlyString(values.date),
      };

      const result = holidayItem?.id
        ? await updateHoliday(holidayItem.id, payload)
        : await createHoliday(payload);

      if (!result.success) {
        toast.warning(result.message || 'ไม่สามารถบันทึกข้อมูลได้');
        return;
      }

      toast.success(result.message || 'บันทึกข้อมูลสำเร็จ');
      await onSubmitted();
      onOpenChange(false);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{holidayItem?.id ? 'แก้ไขวันหยุด' : 'เพิ่มวันหยุด'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="holiday-create-dialog-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    วันที่
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <DatePickerInput
                      value={field.value}
                      onChange={(value) => {
                        if (!value) {
                          return;
                        }
                        field.onChange(value);
                      }}
                      placeholder="เลือกวันที่"
                      isError={Boolean(form.formState.errors.date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ชื่อวันหยุด
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={MAX_LENGTH_100} />
                  </FormControl>
                  <FormMessage />
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
                      showMaxLengthCounter
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-transparent"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              ยกเลิก
            </Button>
          </DialogClose>
          <Button type="submit" form="holiday-create-dialog-form" disabled={isLoading}>
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayCreateDialog;
