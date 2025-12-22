'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/components/pages/setting/user/schema';
import { IUser } from '@/types/setting/user';
import { useLoading } from '@/components/context/app-context';
import { MAX_LENGTH_100 } from '@/lib/constants/validation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LabelGroup, Required } from '@/components/ui/custom/form';
import { handleSignout } from '@/components/layouts/root/actions';
import { handleResetPasswordUser } from '@/lib/action';

type ChangePasswordFormProps = {
  currentData?: IUser;
  formRef: React.RefObject<HTMLFormElement>;
};
const ChangePasswordForm = ({ currentData, formRef }: ChangePasswordFormProps) => {
  const { isLoading, setIsLoading } = useLoading();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      id: currentData?.id,
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    try {
      if (!currentData) return;
      setIsLoading(true);
      const result = await handleResetPasswordUser(currentData.id, values);
      if (result?.message) {
        // toast(result.message);
      }
      if (result?.success) {
        handleSignout(currentData?.id, '/');
      }
    } catch (error) {
      console.error('OnSubmit Error:', error);
      // toast('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        id="user-reset-password-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="flex flex-col px-5">
          <div>
            <h2 className="font-medium text-lg mb-0">ข้อมูลรีเซ็ตรหัสผ่าน</h2>
            <hr className="mt-2 mb-5" />
          </div>

          <div className="px-8 gap-5">
            <div className="flex flex-col gap-5">
              <LabelGroup label="อีเมล" value={currentData?.email} />
              <div className="flex flex-wrap">
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
                          maxLength={MAX_LENGTH_100}
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
                          maxLength={MAX_LENGTH_100}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <ul className="text-sm text-red-500 list-disc pl-4">
                <li>ควรมีความยาวที่เหมาะสม ไม่น้อยกว่า 6 หลัก</li>
                <li>
                  ประกอบด้วยตัวอักษรภาษาอังกฤษ ตัวพิมพ์ใหญ่ (A-Z) ตัวพิมพ์เล็ก (a-z) ตัวเลข (0-9)
                  และอักขระพิเศษ (@, $, !, ?, #)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
