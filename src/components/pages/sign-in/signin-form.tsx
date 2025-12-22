'use client';

import { startTransition, useActionState, useState } from 'react';
import { authenticate } from '@/lib/action';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { signinSchema, SigninSchemaType } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginForm() {
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SigninSchemaType) => {
    try {
      setDisabled(true);
      startTransition(() => {
        formAction(values);
      });
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col px-12 px-sm-6"
        >
          <h1 className={`mb-12 text-5xl font-bold text-center`}>Timecheese</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input
                    placeholder="กรุณาใส่อีเมลของคุณ"
                    {...field}
                    disabled={disabled || isPending}
                    onInput={() => {
                      form.clearErrors('email');
                    }}
                  />
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
                <FormLabel>รหัสผ่่าน</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="กรุณาใส่รหัสผ่านของคุณ"
                    {...field}
                    disabled={disabled || isPending}
                    onInput={() => {
                      form.clearErrors('password');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={disabled || isPending}>
            เข้าสู่ระบบ
          </Button>
        </form>
      </Form>
      {/* <form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`mb-3 text-2xl`}>Please log in to continue.</h1>
          <div className="w-full">
            <div>
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <button className="mt-4 w-full" aria-disabled={isPending}>
            Log in
          </button>
          <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
            {errorMessage && (
              <>
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </form> */}
    </>
  );
}
