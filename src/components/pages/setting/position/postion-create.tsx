'use client';

import { Plus } from 'lucide-react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createPositionSchema,
  CreatePositionSchemaType,
  editPositionSchema,
  EditPositionSchemaType,
} from './schema';
import { useFieldArray, useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import PositionLevelCreate from './position-level-create';
import { IPositionLevel } from '@/types/setting/position';

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

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'levels' });

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
              positionData.levels.map((level: IPositionLevel) => ({
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

  const searchParams = useSearchParams();
  const from = searchParams.get('from')

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
      if (response.ok) {
        if (from == 'detail') {
          router.push(`/setting/position/${id}`);
        } else {
          router.push('/setting/position');
        }
      }
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    } finally {
      console.log('Finally block executed');
    }
  };

  return (
    <Form {...form}>
      <form id="position-create-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:px-10">
          <div className="w-full border px-5 py-5 rounded-sm text-lg">
            <div>
              <h1 className="font-semibold">ข้อมูลตำแหน่ง</h1>
            </div>
            <hr className="mt-1" />
            <div>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full mt-10">
                      <FormLabel>
                        ชื่อตำแหน่ง
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="กรุณากรอกชื่อตำแหน่ง"
                          {...field}
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
                    <FormItem className="w-full mt-5">
                      <FormLabel>คำอธิบาย</FormLabel>
                      <FormControl>
                        <Textarea
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
          </div>
          <div className="w-full min-h-180 max-h-180 border px-10 py-5 rounded-sm text-lg overflow-auto">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">ระดับตำแหน่ง</h1>
              <button
                type="button"
                onClick={() => append({ name: '', description: '' })}
                className="bg-yellow-400 rounded-sm px-3 py-1 cursor-pointer transition-all duration-100 hover:bg-yellow-300"
              >
                <Plus size={15} />
              </button>
            </div>
            <hr className="mt-1" />
            <div>
              {fields.map((field, index) => (
                <PositionLevelCreate
                  key={field.id}
                  index={index}
                  control={form.control}
                  onRemove={() => remove(index)}
                  totalFields={fields.length}
                />
              ))}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
export default PositionCreate;
