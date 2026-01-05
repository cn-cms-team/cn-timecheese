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
import { MAX_LENGTH_255 } from '@/lib/constants/validation';
import CheeseIcon from '@/components/ui/icons/cheese';

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
          className="space-y-8 flex flex-col px-6 md:px-3"
        >
          <div className="flex flex-row justify-center gap-4">
            <CheeseIcon width={55} height={55} />
            <h1
              className={`text-4xl xl:text-5xl text-center text-nature-600 font-bold bg-linear-to-r from-yellow-500 via-pink-500  to-indigo-500
           bg-clip-text text-transparent`}
            >
              TimeCheese
            </h1>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input
                    placeholder="กรุณาใส่อีเมลของคุณ"
                    maxLength={MAX_LENGTH_255}
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
                <FormLabel>รหัสผ่าน</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="กรุณาใส่รหัสผ่านของคุณ"
                    maxLength={MAX_LENGTH_255}
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
          {errorMessage && (
            <div className="text-red-500 text-center mt-2 bg-red-100 rounded p-2 flex items-center gap-1 justify-center text-nowrap">
              <span className="text-xs font-semibold">{errorMessage}</span>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
