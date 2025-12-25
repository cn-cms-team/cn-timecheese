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
import { teamSchema, TeamSchemaType } from './schema';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive } from '@/lib/functions/enum-mapping';
import { useEffect } from 'react';
import { TeamApiResponse, SubmitRequest } from '@/types/setting/team';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { MAX_LENGTH_100, MAX_LENGTH_255 } from '@/lib/constants/validation';
import TitleGroup from '@/components/ui/custom/cev/title-group';

const TeamCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<TeamSchemaType>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });
  const isActiveWatch = form.watch('isActive');

  useEffect(() => {
    const fetchTeamData = async (teamId: string) => {
      try {
        const response = await fetch(`/api/v1/setting/team/${teamId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          const teamObj = result.data as TeamApiResponse | null;
          if (teamObj) {
            form.reset({
              name: teamObj.name ?? '',
              description: teamObj.description ?? '',
              isActive: teamObj.isActive ?? true,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (id) {
      fetchTeamData(id);
    }
  }, []);

  const onSubmit = async (values: TeamSchemaType) => {
    try {
      let fetchUrl = '/api/v1/setting/team';
      const baseData: SubmitRequest = {
        id: id,
        name: values.name,
        description: values.description,
        is_active: values.isActive ?? true,
      };
      if (id) {
        fetchUrl = `/api/v1/setting/team/${id}`;
        baseData.updated_by = session?.user?.id;
        baseData.updated_at = new Date();
      } else {
        baseData.created_by = session?.user?.id;
        baseData.created_at = new Date();
      }

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseData),
      });
      if (response.ok) {
        const result = await response.json();
        toast(result.message);
        router.push('/setting/team');
      }
    } catch {
      toast('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="cev-box">
      <TitleGroup title="รายละเอียดทีม" />
      <Form {...form}>
        <form
          id="team-create-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-x-6 gap-y-5 px-8"
        >
          <div className="flex flex-wrap items-baseline">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>ชื่อทีม</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="กรุณากรอกชื่อทีม"
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
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
          </div>
          <div className="flex flex-wrap items-baseline">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>คำอธิบาย</FormLabel>
                  <FormControl>
                    <Textarea
                      id="small-form-comments"
                      placeholder="กรุณากรอกคำอธิบาย"
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
        </form>
      </Form>
    </div>
  );
};
export default TeamCreate;
