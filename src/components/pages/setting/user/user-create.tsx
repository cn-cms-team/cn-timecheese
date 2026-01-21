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
import { IOptionGroups, IOptions } from '@/types/dropdown';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { Required } from '@/components/ui/custom/form';
import { MAX_LENGTH_100, MAX_LENGTH_255, MAX_LENGTH_50 } from '@/lib/constants/validation';
import { toast } from 'sonner';
import TitleGroup from '@/components/ui/custom/cev/title-group';
import { isEmailUnique } from './action';
import { useLoading } from '@/components/context/app-context';

const UserCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const [teamOptions, setTeamOptions] = useState<IOptions[]>([]);
  const [positionLevelOptions, setPositionLevelOptions] = useState<IOptionGroups[]>([]);
  const [roleOptions, setRoleOptions] = useState<IOptions[]>([]);

  const schema = id ? editUserSchema : createUserSchema;
  const form = useForm<CreateUserSchemaType | EditUserSchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      email: '',
      nick_name: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      code: '',
      team_id: '',
      position_level_id: '',
      role_id: '',
      salary_range: '',
      is_active: true,
    },
  });
  const isActiveWatch = form.watch('is_active');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const prefix = process.env.NEXT_PUBLIC_APP_URL;
        const [team, positionLevel, role] = await Promise.all([
          fetcher<IOptions[]>(`${prefix}/api/v1/master/team`),
          fetcher<IOptionGroups[]>(`${prefix}/api/v1/master/position-level`),
          fetcher<IOptions[]>(`${prefix}/api/v1/master/role`),
        ]);
        setTeamOptions(team);
        setPositionLevelOptions(positionLevel);
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
        setIsLoading(true);
        const response = await fetch(`/api/v1/setting/user/${userId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          const userData = result.data;
          form.reset({
            ...userData,
            start_date: new Date(userData.start_date),
            confirm_password: userData.password,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchUserData(id);
    }
  }, []);

  const onSubmit = async (values: CreateUserSchemaType | EditUserSchemaType) => {
    try {
      const isUniqueEmail = await isEmailUnique(values.email, id || null);
      if (!isUniqueEmail) {
        form.setError('email', {
          type: 'manual',
          message: 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น',
        });
        return;
      }
      let fetchUrl = '/api/v1/setting/user';
      if (id) {
        fetchUrl = `/api/v1/setting/user/${id}`;
      }
      setIsLoading(true);
      const data = {
        id: id,
        email: values.email,
        nick_name: values.nick_name,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        team_id: values.team_id,
        position_level_id: values.position_level_id,
        role_id: values.role_id,
        start_date: values.start_date,
        end_date: values.end_date,
        is_active: values.is_active,
        salary_range: values.salary_range,
        code: values.code,
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
        router.push('/setting/user');
      }
    } catch {
      toast('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลผู้ใช้งาน" />
      <Form {...form}>
        <form
          id="user-create-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-x-6 space-y-5 px-0 lg:px-8"
        >
          <div className="flex flex-wrap items-baseline gap-y-5 mx-0">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    อีเมล
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="กรุณากรอกอีเมลของคุณ"
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
              name="code"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    รหัสพนักงาน
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรุณากรอกรหัสพนักงาน"
                      {...field}
                      maxLength={MAX_LENGTH_50}
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
          {!id && (
            <div className="flex flex-wrap items-baseline gap-y-5 mx-0">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel>
                      รหัสผ่าน
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="กรุณากรอกรหัสผ่าน"
                        maxLength={MAX_LENGTH_255}
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
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel>
                      ยืนยันรหัสผ่าน
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="กรุณากรอกยืนยันรหัสผ่าน"
                        maxLength={MAX_LENGTH_255}
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
            </div>
          )}
          <div className="flex flex-wrap items-baseline gap-y-5 mx-0">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    ชื่อ
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรุณากรอกชื่อ"
                      {...field}
                      maxLength={MAX_LENGTH_100}
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
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    นามสกุล
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรุณากรอกนามสกุล"
                      {...field}
                      maxLength={MAX_LENGTH_100}
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
          <div className="flex flex-wrap items-baseline gap-y-5 mx-0">
            <FormField
              control={form.control}
              name="nick_name"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    ชื่อเล่น
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรุณากรอกชื่อเล่น"
                      {...field}
                      maxLength={MAX_LENGTH_100}
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
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    ทีม
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <ComboboxForm
                      placeholder="เลือกทีม"
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
          </div>
          <div className="flex flex-wrap items-baseline gap-y-5 mx-0">
            <FormField
              control={form.control}
              name="position_level_id"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    ระดับตำแหน่ง
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <ComboboxForm
                      placeholder="เลือกระดับตำแหน่ง"
                      options={positionLevelOptions}
                      isGroup={true}
                      field={field}
                      onSelect={(value) => {
                        field.onChange(value);
                      }}
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
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    สิทธิ์การใช้งาน
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <ComboboxForm
                      placeholder="เลือกสิทธิ์การใช้งาน"
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
          </div>
          <div className="flex flex-wrap items-baseline gap-y-5 mx-0">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    วันที่เริ่มต้น
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <DatePickerInput
                      {...field}
                      value={field.value}
                      startMonth={undefined}
                      endMonth={undefined}
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
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>วันที่สิ้นสุด</FormLabel>
                  <FormControl>
                    <DatePickerInput
                      {...field}
                      value={field.value ? new Date(field.value) : undefined}
                      startMonth={undefined}
                      endMonth={undefined}
                      placeholder="กรุณาเลือกวันที่สิ้นสุดของคุณ"
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-wrap items-baseline gap-y-5 mx-0">
            <FormField
              control={form.control}
              name="salary_range"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>ช่วงเงินเดือนโดยประมาณ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรุณากรอกช่วงเงินเดือนโดยประมาณ"
                      {...field}
                      value={field.value || ''}
                      maxLength={MAX_LENGTH_100}
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
              name="is_active"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>สถานะการใช้งาน</FormLabel>
                  <FormControl>
                    <div className="flex align-middle space-x-2 mt-2">
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
          </div>
        </form>
      </Form>
    </div>
  );
};
export default UserCreate;
