'use client';

import { startTransition, useActionState, useState } from 'react';
import { authenticate } from '@/lib/action';
import { useForm } from 'react-hook-form';
import { signinSchema, SigninSchemaType } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { MAX_LENGTH_255 } from '@/lib/constants/validation';
import { ArrowRight, Lock, Mail } from 'lucide-react';

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block" htmlFor="email">
            อีเมล
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...form.register('email')}
              id="email"
              type="email"
              maxLength={MAX_LENGTH_255}
              disabled={disabled || isPending}
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
              placeholder="name@clicknext.co.th"
              required
              autoComplete="off"
            />
          </div>
          {form.formState.errors.email && <p role="alert">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 block" htmlFor="password">
              รหัสผ่าน
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...form.register('password')}
              id="password"
              type="password"
              maxLength={MAX_LENGTH_255}
              disabled={disabled || isPending}
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              required
              autoComplete="off"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          เข้าสู่ระบบ
          <ArrowRight className="w-5 h-5" />
        </button>
        {errorMessage && (
          <div className="text-red-500 text-center bg-red-100 rounded p-2 flex items-center gap-1 justify-center text-nowrap">
            <span className="text-xs font-semibold">{errorMessage}</span>
          </div>
        )}
      </form>
    </>
  );
}
