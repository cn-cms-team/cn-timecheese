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
import {
  createUserSchema,
  editUserSchema,
  CreateUserSchemaType,
  EditUserSchemaType,
} from './schema';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { IOptions } from '@/types/dropdown';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { useSession } from 'next-auth/react';

const UserCreate = ({ id }: { id?: string }): React.ReactNode => {
  const { data: session } = useSession();
  const router = useRouter();

  const [teamOptions, setTeamOptions] = useState<IOptions[]>([]);
  const [postitionOptions, setPostitionOptions] = useState<IOptions[]>([]);
  const [positionLevelOptions, setPostitionLevelOptions] = useState<IOptions[]>([]);
  const [roleOptions, setRoleOptions] = useState<IOptions[]>([]);

  const schema = id ? editUserSchema : createUserSchema;
  const form = useForm<CreateUserSchemaType | EditUserSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      nick_name: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      team_id: '',
      position_id: '',
      position_level_id: '',
      role_id: '',
      is_active: true,
    },
  });
  const isActiveWatch = form.watch('is_active');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const prefix = process.env.NEXT_PUBLIC_APP_URL;
        const [team, position, positionLevel, role] = await Promise.all([
          fetcher<IOptions[]>(`${prefix}/api/v1/master/team`),
          fetcher<IOptions[]>(`${prefix}/api/v1/master/position`),
          fetcher<IOptions[]>(`${prefix}/api/v1/master/position-level`),
          fetcher<IOptions[]>(`${prefix}/api/v1/master/role`),
        ]);
        setTeamOptions(team);
        setPostitionOptions(position);
        setPostitionLevelOptions(positionLevel);
        setRoleOptions(role);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const response = await fetch(`/api/v1/setting/user/${userId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          const userData = result.data;
          form.reset({ ...userData, confirm_password: userData.password });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (id) {
      fetchUserData(id);
    }
  }, []);

  const onSubmit = async (values: CreateUserSchemaType | EditUserSchemaType) => {
    try {
      let fetchUrl = '/api/v1/setting/user';
      if (id) {
        fetchUrl = `/api/v1/setting/user/${id}`;
      }
      const data = { ...values, code: 'B-1', created_by: session?.user?.id };
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Create Successful', result);
        router.push('/setting/user');
      }
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    } finally {
      console.log('Finally block executed');
    }
  };

  return (
    <div className="flex flex-col px-5">
      <h2 className="font-medium text-lg mb-0">ข้อมูลผู้ใช้งาน</h2>
      <hr className="mt-2 mb-5" />
      <Form {...form}>
        <form
          id="user-create-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-6 gap-y-5 px-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input
                    placeholder="กรุณากรอกอีเมลของคุณ"
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
            name="nick_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อเล่น</FormLabel>
                <FormControl>
                  <Input
                    placeholder="กรุณากรอกชื่อเล่นของคุณ"
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
          {!id && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="กรุณากรอกรหัสผ่านของคุณ"
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
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="กรุณากรอกยืนยันรหัสผ่านของคุณ"
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
            </>
          )}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="กรุณากรอกชื่อของคุณ"
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
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input
                    placeholder="กรุณากรอกนามสกุลของคุณ"
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
            name="team_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ทีม</FormLabel>
                <FormControl>
                  <ComboboxForm
                    placeholder="เลือกทีมของคุณ"
                    options={teamOptions}
                    field={field}
                    onSelect={(value) => field.onChange(value)}
                    isError={form.formState.errors.team_id ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ตำแหน่ง</FormLabel>
                <FormControl>
                  <ComboboxForm
                    placeholder="เลือกตำแหน่งของคุณ"
                    options={postitionOptions}
                    field={field}
                    onSelect={(value) => field.onChange(value)}
                    isError={form.formState.errors.position_id ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position_level_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ระดับตำแหน่ง</FormLabel>
                <FormControl>
                  <ComboboxForm
                    placeholder="เลือกระดับตำแหน่งของคุณ"
                    options={positionLevelOptions}
                    field={field}
                    onSelect={(value) => field.onChange(value)}
                    isError={form.formState.errors.position_level_id ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สิทธิ์การใช้งาน</FormLabel>
                <FormControl>
                  <ComboboxForm
                    placeholder="เลือกสิทธิ์การใช้งานของคุณ"
                    options={roleOptions}
                    field={field}
                    onSelect={(value) => field.onChange(value)}
                    isError={form.formState.errors.role_id ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่เริ่มต้น</FormLabel>
                <FormControl>
                  <DatePickerInput
                    value={field.value}
                    placeholder="กรุณาเลือกวันที่เริ่มต้นของคุณ"
                    isError={form.formState.errors.start_date ? true : false}
                    onChange={field.onChange}
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
                <FormLabel>วันที่สิ้นสุด</FormLabel>
                <FormControl>
                  <DatePickerInput
                    value={field.value}
                    placeholder="กรุณาเลือกวันที่สิ้นสุดของคุณ"
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สถานะการใช้งาน</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      id="is-active"
                    />
                    <Label htmlFor="is-active">{getIsActive(isActiveWatch as boolean)}</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
export default UserCreate;
