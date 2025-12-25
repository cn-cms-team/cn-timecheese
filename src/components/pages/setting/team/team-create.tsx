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
import { useEffect, useState } from 'react';
import { TeamMember, TeamApiResponse, SubmitRequest } from '@/types/setting/team';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { ITeam } from '@/types/setting/team';
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
  const [membersOrder, setMembersOrder] = useState<TeamMember[]>([]);
  const [teamData, setTeamData] = useState<ITeam>();

  useEffect(() => {
    const fetchTeamData = async (teamId: string) => {
      try {
        const response = await fetch(`/api/v1/setting/team/${teamId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          setTeamData(result.data);
          const teamObj = result.data as TeamApiResponse | null;
          if (teamObj) {
            const users: TeamMember[] = teamObj.users ?? [];
            setMembersOrder(users);
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

  const changeStatus = async (id: string, team_id: string, status: boolean) => {
    try {
      const fetchUrl = `/api/v1/setting/team/${team_id}/member`;
      const data = {
        user_id: id,
        status: status,
      };
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();
      toast(result.message);
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
      {id && (
        <div className="mt-6">
          <TitleGroup title="สมาชิกทีม" />
          <Card className="w-full max-w-full">
            <CardContent>
              <div className="overflow-x-auto">
                {membersOrder.length === 0 ? (
                  <p className="text-center text-gray-400 font-semibold text-lg">
                    ไม่มีสมาชิกในทีมนี้
                  </p>
                ) : (
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="">
                        <th className="text-left px-3 py-2 border-b w-[50%] md:w-[80%]">สมาชิก</th>
                        <th className="text-center px-3 py-2 border-b w-[50%] md:w-[20%]">
                          สิทธิ์การเห็นข้อมูลสมาชิกในทีม
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersOrder.map((item) => (
                        <tr key={item.id} className="odd:bg-card even:bg-card/50">
                          <td className="px-3 py-2 align-middle w-[50%] md:w-[80%]">
                            <span className="font-medium">{item.name}</span>
                            <div className="text-sm text-muted-foreground">{teamData?.name}</div>
                          </td>
                          <td className="px-3 py-2 align-middle text-center w-[50%] md:w-[20%]">
                            <label className="inline-flex items-center space-x-2 justify-end">
                              <Switch
                                checked={item.isManager}
                                onCheckedChange={(checked) => {
                                  changeStatus(
                                    item.id,
                                    teamData?.id ?? item.teamId,
                                    !item.isManager
                                  );
                                  setMembersOrder((prev) => {
                                    return prev.map((m) => {
                                      if (m.id === item.id) {
                                        return { ...m, isManager: checked };
                                      }
                                      return m;
                                    });
                                  });
                                }}
                                id="is-leader-active"
                              />
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default TeamCreate;
