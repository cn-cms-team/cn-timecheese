'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IOptions } from '@/types/dropdown';
import { useSession } from 'next-auth/react';
import { LabelGroup, Required } from '@/components/ui/custom/form';
import { MAX_LENGTH_255, MAX_LENGTH_50 } from '@/lib/constants/validation';
import { toast } from 'sonner';
import { taskTypeSchema, TaskTypeSchemaType } from './schema';
import { Textarea } from '@/components/ui/textarea';

const TaskTypeCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();

  const form = useForm<TaskTypeSchemaType>({
    resolver: zodResolver(taskTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      is_active: false,
    },
  });

  useEffect(() => {
    const fetchTaskTypeData = async (task_type_id: string) => {
      try {
        const response = await fetch(`/api/v1/setting/task-type/${task_type_id}`, {
          method: 'GET',
        });
        const result = await response.json();
        if (response.ok) {
          const task_typeData = result.data;
          form.reset({ ...task_typeData, confirm_password: task_typeData.password });
        }
      } catch (error) {
        console.error('Failed to fetch task-type data:', error);
      }
    };
    if (id) {
      fetchTaskTypeData(id);
    }
  }, []);

  const onSubmit = async (values: TaskTypeSchemaType) => {
    try {
      let fetchUrl = '/api/v1/setting/task-type';
      if (id) {
        fetchUrl = `/api/v1/setting/task-type/${id}`;
      }
      const data = {
        id: id,
        name: values.name,
        description: values.description,
        type: values.type,
        is_active: values.is_active,
      };
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        const result = await response.json();

        toast(result.message);
        router.push('/setting/task-type');
      }
    } catch {
      toast('An unexpected error occurred. Please try again.');
    } finally {
      console.log('Finally block executed');
    }
  };

  return (
    <div className="flex flex-col px-5">
      <h2 className="font-medium text-lg mb-0">ข้อมูลหมวดหมู่งาน</h2>
      <hr className="mt-2 mb-5" />
      <div className="flex flex-col space-y-5 px-8 mb-5">
        <LabelGroup label="ชื่อ" className="w-full sm:w-1/2" value={''} />

        <LabelGroup label="คำอธิบาย" value={''} />
      </div>
      <h2 className="font-medium text-lg mb-0">ข้อมูลประเภทงาน</h2>
      <hr className="mt-2 mb-5" />
      <Form {...form}>
        <form
          id="task-type-create-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-x-6 space-y-5 px-8"
        >
          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>ชื่อ</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="กรุณากรอกชื่อประเภทงาน"
                    {...field}
                    maxLength={MAX_LENGTH_255}
                    onInput={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>คำอธิบาย</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="กรุณากรอกคำอธิบายประเภทงาน"
                    {...field}
                    maxLength={MAX_LENGTH_255}
                    onInput={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="flex flex-wrap items-baseline"></div>
        </form>
      </Form>
    </div>
  );
};
export default TaskTypeCreate;
