'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useLoading } from '@/components/context/app-context';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import Required from '@/components/ui/custom/form/required';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { okrObjectiveSchema, OkrObjectiveSchemaType } from '@/components/pages/okrs/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MAX_LENGTH_255, MAX_LENGTH_50 } from '@/lib/constants/validation';
import { IOkrObjectiveDetail } from '@/types/okr';

const createDefaultKeyResult = (): OkrObjectiveSchemaType['keyResults'][number] => ({
  title: '',
  start_date: new Date(),
  end_date: new Date(),
  target: 0,
  progress: 0,
  unit: '',
});

const OkrForm = ({ id }: { id?: string }) => {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const form = useForm<OkrObjectiveSchemaType>({
    resolver: zodResolver(okrObjectiveSchema) as Resolver<OkrObjectiveSchemaType>,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      keyResults: [createDefaultKeyResult()],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'keyResults',
  });

  useEffect(() => {
    const fetchObjective = async () => {
      if (!id) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/okrs/${id}`, { method: 'GET' });
        const result = await response.json();

        if (!response.ok) {
          toast.warning(result.message || 'ไม่สามารถโหลดข้อมูล OKR ได้');
          router.push('/okrs');
          return;
        }

        const objective = result.data as IOkrObjectiveDetail;
        if (!objective.is_owner) {
          toast.warning('คุณสามารถแก้ไขได้เฉพาะ OKR ของตัวเอง');
          router.push(`/okrs/${id}`);
          return;
        }

        form.reset({
          title: objective.title,
          keyResults: objective.key_results.map((item) => ({
            id: item.id,
            title: item.title,
            start_date: new Date(item.start_date),
            end_date: new Date(item.end_date),
            target: item.target,
            progress: item.progress,
            unit: item.unit ?? '',
          })),
        });
      } catch {
        toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
        router.push('/okrs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjective();
  }, [form, id, router, setIsLoading]);

  const onSubmit = async (values: OkrObjectiveSchemaType) => {
    try {
      setIsLoading(true);

      const response = await fetch(id ? `/api/v1/okrs/${id}` : '/api/v1/okrs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: values }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.warning(result.message || 'ไม่สามารถบันทึกข้อมูล OKR ได้');
        return;
      }

      toast.success(result.message || 'บันทึกข้อมูลสำเร็จ');
      const nextId = id ?? result.data?.id;
      router.push(nextId ? `/okrs/${nextId}` : '/okrs');
      router.refresh();
    } catch {
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form id="okr-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="gap-4 py-4">
          <CardHeader>
            <CardTitle>ข้อมูล Objective</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Objective
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      maxLength={MAX_LENGTH_255}
                      placeholder="เช่น เพิ่มประสิทธิภาพการส่งมอบงานของทีม"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="gap-4 py-4">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Key Results</CardTitle>
              <p className="text-muted-foreground text-sm">
                กำหนดผลลัพธ์ที่วัดผลได้อย่างน้อย 1 รายการ
              </p>
            </div>
            <Button type="button" onClick={() => append(createDefaultKeyResult())}>
              <Plus className="w-4 h-4" />
              เพิ่ม Key Result
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeof form.formState.errors.keyResults?.message === 'string' && (
              <p className="text-sm text-destructive">{form.formState.errors.keyResults.message}</p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Key Result {index + 1}</p>
                    <p className="text-muted-foreground text-sm">
                      กำหนดเป้าหมาย ช่วงเวลา และความคืบหน้า
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => move(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => move(index, index + 1)}
                      disabled={index === fields.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`keyResults.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>
                          ชื่อ Key Result
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="off"
                            maxLength={MAX_LENGTH_255}
                            placeholder="เช่น ลดเวลาปิดงานเฉลี่ยลง 20%"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`keyResults.${index}.start_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          วันที่เริ่มต้น
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <DatePickerInput
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={field.onChange}
                            placeholder="เลือกวันที่เริ่มต้น"
                            isError={Boolean(form.formState.errors.keyResults?.[index]?.start_date)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`keyResults.${index}.end_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          วันที่สิ้นสุด
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <DatePickerInput
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={field.onChange}
                            placeholder="เลือกวันที่สิ้นสุด"
                            isError={Boolean(form.formState.errors.keyResults?.[index]?.end_date)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`keyResults.${index}.target`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ค่าเป้าหมาย
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="1"
                            value={field.value ?? 0}
                            onChange={(event) => field.onChange(event.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`keyResults.${index}.progress`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ความคืบหน้า
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="1"
                            value={field.value ?? 0}
                            onChange={(event) => field.onChange(event.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`keyResults.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หน่วย</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            autoComplete="off"
                            maxLength={MAX_LENGTH_50}
                            placeholder="เช่น %, งาน, ชั่วโมง"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default OkrForm;
