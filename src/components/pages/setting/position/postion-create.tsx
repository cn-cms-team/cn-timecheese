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
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createPositionSchema,
  CreatePositionSchemaType,
  editPositionSchema,
  EditPositionSchemaType,
} from './schema';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { IPositionLevelRequest } from '@/types/setting/position';
import { toast } from 'sonner';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';
import { TitleGroup } from '@/components/ui/custom/cev';
import { useLoading } from '@/components/context/app-context';

import PositionFormTable from './position-form-table/position-form-table';

const PositionCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const { setIsLoading } = useLoading();
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

  useEffect(() => {
    const fetchPositionData = async (positionId: string) => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchPositionData(id);
    }
  }, []);

  const onSubmit = async (values: CreatePositionSchemaType | EditPositionSchemaType) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form id="position-create-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full px-6 py-5 rounded-lg ">
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
            <div className="w-full mt-4">
              <TitleGroup title="ระดับตำแหน่ง" />
              <PositionFormTable form={form} />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PositionCreate;
