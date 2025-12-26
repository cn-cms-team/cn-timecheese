'use client';
import { useLoading } from '@/components/context/app-context';
import { MAX_LENGTH_255 } from '@/lib/constants/validation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { LabelGroup, Required } from '@/components/ui/custom/form';
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/components/pages/setting/user/schema';
import { IUser } from '@/types/setting/user';
import { handleSignout } from '@/components/layouts/root/actions';
import { handleResetPasswordUser } from '@/lib/action';
import { useEffect } from 'react';
import { toast } from 'sonner';
import TitleGroup from '@/components/ui/custom/cev/title-group';

type ResetPasswordFormProps = {
  userData?: IUser;
};
const ResetPasswordForm = ({ userData }: ResetPasswordFormProps) => {
  const { isLoading, setIsLoading } = useLoading();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      id: '',
      password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (userData?.id) {
      form.reset({ id: userData.id });
    }
    return () => {};
  }, [userData?.id]);

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    try {
      if (!userData) return;
      setIsLoading(true);
      const result = await handleResetPasswordUser(userData.id, values);
      if (result?.message) {
        toast(result.message);
      }
      if (result?.success) {
        handleSignout(userData?.id, '/');
      }
    } catch (error) {
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
          id="user-reset-password-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-x-6 gap-y-5 px-8"
        >
          <div className="flex flex-col gap-5">
            <LabelGroup label="อีเมล" value={userData?.email} />
            <div className="flex flex-wrap items-baseline">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>
                      รหัสผ่าน
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        maxLength={MAX_LENGTH_255}
                        disabled={isLoading}
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
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>
                      ยืนยันรหัสผ่าน
                      <Required />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        maxLength={MAX_LENGTH_255}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ul className="text-sm text-gray-500 list-disc pl-4">
              <li>ควรมีความยาวที่เหมาะสม ไม่น้อยกว่า 6 หลัก</li>
              <li>
                ประกอบด้วยตัวอักษรภาษาอังกฤษ ตัวพิมพ์ใหญ่ (A-Z) ตัวพิมพ์เล็ก (a-z) ตัวเลข (0-9)
                และอักขระพิเศษ (@, $, !, ?, #)
              </li>
            </ul>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
