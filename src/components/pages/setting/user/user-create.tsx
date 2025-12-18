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
import { createUserSchema, CreateUserSchemaType } from './schema';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { Select } from '@/components/ui/select';
import { ComboboxForm } from '@/components/ui/custom/combobox';

const UserCreate = (): React.ReactNode => {
  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      team_id: '',
      position_id: '',
      position_level_id: '',
      role_id: '',
      start_date: '',
      end_date: '',
      is_active: true,
    },
  });
  const isActiveWatch = form.watch('is_active');

  const onSubmit = (values: CreateUserSchemaType) => {
    try {
      console.log('Submit Create User', values);
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    } finally {
      console.log('Finally block executed');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h3>ข้อมูลผู้ใช้งาน</h3>
      <hr className="mt-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-6 gap-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input placeholder="กรุณากรอกอีเมลของคุณ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อเล่น</FormLabel>
                <FormControl>
                  <Input placeholder="กรุณากรอกชื่อเล่นของคุณ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ</FormLabel>
                <FormControl>
                  <Input placeholder="กรุณากรอกชื่อของคุณ" {...field} />
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
                  <Input placeholder="กรุณากรอกนามสกุลของคุณ" {...field} />
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
                    options={[]}
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
                    options={[]}
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
                    options={[]}
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
                    options={[]}
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
                  <Input placeholder="กรุณาเลือกวันที่เริ่มต้นของคุณ" {...field} />
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
                  <Input placeholder="กรุณาเลือกวันที่สิ้นสุดของคุณ" {...field} />
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
