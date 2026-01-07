'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createPositionSchema,
  CreatePositionSchemaType,
  editPositionSchema,
  EditPositionSchemaType,
} from './schema';
import { useFieldArray, useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import PositionLevelCreate from './position-level-create';
import { IPositionLevelRequest } from '@/types/setting/position';
import { toast } from 'sonner';
import PositionLevelCreateBtn from './position-level-create-btn';
import useDialogConfirm, { ConfirmType } from '@/hooks/use-dialog-confirm';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';
import { TitleGroup } from '@/components/ui/custom/cev';

const PositionCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const schema = id ? editPositionSchema : createPositionSchema;
  const form = useForm<CreatePositionSchemaType | EditPositionSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      levels: [
        {
          name: '',
          description: '',
        },
      ],
    },
  });
  const levelsWatch = form.watch('levels');
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'levels' });

  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmType?: ConfirmType;
  }>({
    title: '',
    message: '',
    confirmType: ConfirmType.SUBMIT,
  });
  const [getConfirmation, Confirmation] = useDialogConfirm();
  const onDeleteLevel = async (index: number, name: string) => {
    try {
      const level = form.getValues(`levels.${index}`);
      if (!level.id) {
        remove(index);
        return;
      }
      setConfirmState({
        title: 'ลบข้อมูล',
        message: `คุณยืนยันที่จะลบข้อมูลระดับตำแหน่ง : ${name} ใช่หรือไม่ ?`,
        confirmType: ConfirmType.DELETE,
      });
      const result = await getConfirmation();
      if (result) {
        remove(index);
        router.push(`/setting/position/${id}/edit`);
      }
    } catch {
      toast('An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const fetchPositionData = async (positionId: string) => {
      try {
        const response = await fetch(`/api/v1/setting/position/${positionId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          const positionData = result.data;
          form.reset({
            name: positionData.name ?? '',
            description: positionData.description || '',
            levels:
              positionData.levels.map((level: IPositionLevelRequest) => ({
                ...level,
                description: level.description || '',
              })) || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch position data:', error);
      }
    };
    if (id) {
      fetchPositionData(id);
    }
  }, []);

  const onSubmit = async (values: CreatePositionSchemaType | EditPositionSchemaType) => {
    try {
      let fetchUrl = '/api/v1/setting/position';
      let method = 'POST';
      if (id) {
        fetchUrl = `/api/v1/setting/position/${id}`;
        method = 'PUT';
      }
      const data = {
        name: values.name,
        description: values.description,
        levels: values.levels.map((level, index) => ({
          id: level.id,
          ord: index + 1,
          name: level.name,
          description: level.description || '',
        })),
      };
      const response = await fetch(fetchUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();
      if (response.ok) {
        if (id) {
          toast(result.message);
        } else {
          toast(result.message);
        }
        router.push('/setting/position');
      }
    } catch {
      toast('An unexpected error occurred. Please try again.');
    } finally {
      console.log('Finally block executed');
    }
  };

  return (
    <>
      <Form {...form}>
        <form id="position-create-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:px-10 lg:py-10">
            <div className="w-full h-fit border px-6 py-5 rounded-lg shadow-sm">
              <TitleGroup title="ข้อมูลตำแหน่ง" />
              <div className="flex flex-col gap-5 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        ชื่อตำแหน่ง
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          maxLength={MAX_LENGTH_100}
                          {...field}
                          autoComplete="off"
                          placeholder="กรุณากรอกชื่อตำแหน่ง"
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
                          maxLength={MAX_LENGTH_255}
                          {...field}
                          value={field.value}
                          className="h-20"
                          autoComplete="off"
                          placeholder="กรุณากรอกคำอธิบายตำแหน่ง"
                          onInput={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full h-full border px-6 py-5 rounded-lg shadow-sm overflow-auto">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-lg mb-0">ระดับตำแหน่ง</h1>
                <PositionLevelCreateBtn onAppend={() => append({ name: '', description: '' })} />
              </div>
              <hr className="mt-2 mb-5" />
              <div>
                {fields.map((field, index) => (
                  <PositionLevelCreate
                    key={field.id}
                    index={index}
                    control={form.control}
                    totalFields={fields.length}
                    is_used={levelsWatch?.[index]?.is_used}
                    onRemove={() => onDeleteLevel(index, field.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>
      </Form>
      <Confirmation
        title={confirmState.title}
        message={confirmState.message}
        confirmType={confirmState.confirmType}
      />
    </>
  );
};
export default PositionCreate;
