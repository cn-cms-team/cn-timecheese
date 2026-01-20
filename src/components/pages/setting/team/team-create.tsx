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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Required } from '@/components/ui/custom/form';

const TeamCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<TeamSchemaType>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });
  const isActiveWatch = form.watch('is_active');
  const [membersOrder, setMembersOrder] = useState<TeamMember[]>([]);
  const [teamData, setTeamData] = useState<ITeam>();
  const header = [
    { label: 'สมาชิก', className: 'text-start min-w-[300px]' },
    { label: 'สิทธิ์การเห็นข้อมูลสมาชิกในทีม', className: 'text-center' },
  ];

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
              is_active: teamObj.is_active ?? true,
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
        is_active: values.is_active ?? true,
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
                  <FormLabel>
                    ชื่อทีม
                    <Required />
                  </FormLabel>
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
          <div className="flex flex-wrap items-baseline">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>
                    คำอธิบาย
                    <Required />
                  </FormLabel>
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
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f2f4f7]">
                  {header.map(({ label, className }) => (
                    <TableHead key={label} className={className}>
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!membersOrder || membersOrder.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={header.length}
                      className="h-24 text-center text-muted-foreground "
                    >
                      ไม่มีข้อมูล
                    </TableCell>
                  </TableRow>
                ) : (
                  membersOrder &&
                  membersOrder.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-muted-foreground">
                          {item?.position_level ? item?.position_level?.name : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Switch
                            checked={item.isManager}
                            onCheckedChange={(checked) => {
                              changeStatus(item.id, teamData?.id ?? item.teamId, !item.isManager);
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeamCreate;
