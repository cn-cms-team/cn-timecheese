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
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

const TeamCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const { data: session } = useSession();

  const [leadList, setLeadList] = useState<string[]>([]);

  const form = useForm<TeamSchemaType>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });
  const isActiveWatch = form.watch('is_active');
  const [membersOrder, setMembersOrder] = useState<
    Array<{ id: string; name: string; isManager: boolean; team: string; team_id: string }>
  >([]);

  useEffect(() => {
    const fetchUserData = async (teamId: string) => {
      try {
        const response = await fetch(`/api/v1/setting/team/${teamId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          const teamObj = result.data;
          if (teamObj) {
            const users: any[] = teamObj.users ?? [];
            const teamLeaders: any[] = teamObj.teamLeaders ?? [];
            const leaderIds = teamLeaders
              .map((item: any) => {
                if (!item) return null;
                if (typeof item === 'string') return item;
                return item.user_id ?? item.id ?? null;
              })
              .filter(Boolean);

            let mapped = users.map((u: any) => ({
              id: u.id,
              name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
              isManager: leaderIds.includes(u.id),
              team: teamObj.name ?? '',
              team_id: teamObj.id ?? '',
            }));

            mapped = mapped.sort(
              (a, b) => (b.isManager === true ? 1 : 0) - (a.isManager === true ? 1 : 0)
            );

            setMembersOrder(mapped);
            setLeadList(leaderIds);

            form.reset({
              name: teamObj.name ?? '',
              description: teamObj.description ?? '',
              is_active: teamObj.is_active ?? true,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    if (id) {
      fetchUserData(id);
    }
  }, []);

  const onSubmit = async (values: TeamSchemaType) => {
    try {
      let fetchUrl = '/api/v1/setting/team';
      const baseData: any = {
        id: id,
        name: values.name,
        description: values.description,
        is_active: values.is_active,
      };

      let data: any;
      if (id) {
        fetchUrl = `/api/v1/setting/team/${id}`;
        data = {
          ...baseData,
          updated_by: session?.user?.id,
        };
      } else {
        data = {
          ...baseData,
          created_by: session?.user?.id,
        };
      }

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        const result = await response.json();
        router.push('/setting/team');
      }
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    }
  };

  const changeStatus = async (id: string, team_id: string, status: boolean) => {
    try {
      const fetchUrl = `/api/v1/setting/team/${id}/member`;
      const data = {
        id: id,
        team_id: team_id,
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
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col px-5">
      <h2 className="font-medium text-lg mb-0">รายละเอียดทีม</h2>
      <hr className="mt-2 mb-5" />
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

          {id && (
            <div>
              <h2 className="font-medium text-lg mb-0">การจัดการสมาชิก</h2>
              <hr className="mt-2 mb-5" />
              <Card className="w-full max-w-full">
                <CardHeader>
                  <CardTitle>ทีม</CardTitle>
                  <hr className="mt-2 mb-5" />
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
                              <th className="text-left px-3 py-2 border-b w-[80%]">ชื่อสมาชิก</th>
                              <th className="text-center px-3 py-2 border-b w-[20%]">
                                จัดการสมาชิก
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {membersOrder
                              .slice()
                              .sort(
                                (a, b) =>
                                  (leadList.includes(b.id) ? 1 : 0) -
                                  (leadList.includes(a.id) ? 1 : 0)
                              )
                              .map((item) => (
                                <tr key={item.id} className="odd:bg-card even:bg-card/50">
                                  <td className="px-3 py-2 align-middle w-[80%]">
                                    <span className="font-medium">{item.name}</span>
                                    <div className="text-sm text-muted-foreground">{item.team}</div>
                                  </td>
                                  <td className="px-3 py-2 align-middle text-center w-[20%]">
                                    <label className="inline-flex items-center space-x-2 justify-end">
                                      <Switch
                                        checked={item.isManager}
                                        onCheckedChange={(checked) => {
                                          changeStatus(item.id, item.team_id, !item.isManager);
                                          setMembersOrder((prev) => {
                                            return prev.map((m) => {
                                              if (m.id === item.id) {
                                                return { ...m, isManager: checked };
                                              }
                                              return m;
                                            });
                                          });
                                        }}
                                        id="is-active"
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
                </CardHeader>
              </Card>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
export default TeamCreate;
