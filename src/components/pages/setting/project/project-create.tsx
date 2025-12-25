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
import {
  createProjectSchema,
  editProjectSchema,
  CreateProjectSchemaType,
  EditProjectSchemaType,
} from './schema';
import { ComboboxForm } from '@/components/ui/custom/combobox';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { IOptions } from '@/types/dropdown';
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { useSession } from 'next-auth/react';
import Required from '@/components/ui/custom/form/required';
import { Button } from '@/components/ui/button';
import useDialogConfirm from '@/hooks/use-dialog-confirm';
import { projectStatusOptions } from '@/lib/constants/select-options';
import ProjectMemberTable from './project-member-table';
import ProjectTaskTable from './project-task-table';
import { UserInfo } from '@/types/setting/project';
import { Textarea } from '@/components/ui/textarea';

const ProjectCreate = ({ id }: { id?: string }): React.ReactNode => {
  const { data: session } = useSession();
  const router = useRouter();

  const [teamOptions, setTeamOptions] = useState<IOptions[]>([]);
  const [userOptions, setUserOptions] = useState<UserInfo[]>([]);
  const [getConfirmation, Confirmation] = useDialogConfirm();

  const schema = id ? editProjectSchema : createProjectSchema;
  const form = useForm<EditProjectSchemaType | CreateProjectSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      code: '',
      name: '',
      status: '',
      description: '',
      member: [],
      main_task_type: [],
      optional_task_type: [],
    },
  });

  useEffect(() => {
    const fetchTeamsOptions = async () => {
      try {
        const prefix = process.env.NEXT_PUBLIC_APP_URL;
        const [team, user] = await Promise.all([
          fetcher<IOptions[]>(`${prefix}/api/v1/master/team`),
          fetcher<UserInfo[]>(`${prefix}/api/v1/master/user`),
        ]);
        const userMap = user.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        setTeamOptions(team);
        setUserOptions(userMap);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchTeamsOptions();
  }, []);

  useEffect(() => {
    const fetchProjectData = async (projectId: string) => {
      try {
        const response = await fetch(`/api/v1/setting/project/${projectId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          const projectData = result.data;
          form.reset({ ...projectData });
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      }
    };
    if (id) {
      fetchProjectData(id);
    }
  }, []);

  const onSubmit = async (values: CreateProjectSchemaType | EditProjectSchemaType) => {
    try {
      let fetchUrl = '/api/v1/setting/project';
      if (id) {
        fetchUrl = `/api/v1/setting/project/${id}`;
      }

      const data = {
        id: id,
        name: values.name,
        code: values.code,
        start_date: values.start_date,
        end_date: values.end_date,
        status: values.status,
        description: values.description,
        value: values.value,
        people_cost: values.people_cost,
        people_cost_percent: values.people_cost_percent,
        created_by: session?.user?.id,
        member: values.member.map((item) => ({
          ...item,
          work_hours: item.work_day ? item.work_day * 8 : 0,
          hour_price: item.day_price ? item.day_price / 8 : 0,
        })),
        main_task_type: values.main_task_type,
        optional_task_type: values.optional_task_type,
      };
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        router.push('/setting/project');
      }
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    } finally {
      console.log('Finally block executed');
    }
  };

  const headersTableMember = [
    { label: 'ทีม', className: 'text-center min-w-50 max-w-50' },
    { label: 'ชื่อ-นามสกุล', className: 'text-center min-w-60 max-w-60' },
    { label: 'ตำแหน่ง', className: 'text-center min-w-60 max-w-60' },
    { label: 'ค่าใช้จ่ายต่อวัน', className: 'text-center min-w-60 max-w-60' },
    { label: 'วันที่เข้าร่วม', className: 'text-center min-w-60 max-w-60' },
    { label: 'วันที่สิ้นสุด', className: 'text-center min-w-60 max-w-60' },
    { label: 'จำนวนวัน', className: 'text-center min-w-20 max-w-20' },
    { label: 'ค่าใช้จ่ายโดยประมาณ', className: 'text-center min-w-60 max-w-60' },
  ];

  const headersTableTask = [
    { label: 'หมวดหมู่', className: 'text-center min-w-20' },
    { label: 'ประเภทงาน', className: 'text-center min-w-20' },
    { label: 'คำอธิบาย', className: 'text-center' },
    { label: '', className: 'text-center' },
  ];

  const defaultMemberDetail = {
    team_id: '',
    user_id: '',
    role: '',
    day_price: 0,
    start_date: null!,
    end_date: null!,
    work_hours: 0,
    hour_price: 0,
    estimated_cost: 0,
  };

  const defaultTaskType = {
    type: '',
    name: '',
    description: '',
  };

  const handleAddMember = () => {
    form.setValue('member', [...form.getValues('member'), defaultMemberDetail]);
  };

  const handleAddMainTaskType = () => {
    form.setValue('main_task_type', [...form.getValues('main_task_type'), defaultTaskType]);
  };

  const handleAddOptionalTaskType = () => {
    form.setValue('optional_task_type', [...form.getValues('optional_task_type'), defaultTaskType]);
  };

  const [lastChanged, setLastChanged] = useState<'people_cost' | 'people_cost_percent' | null>(
    null
  );

  const projectCost = form.watch('value');
  const peopleCost = form.watch('people_cost');
  const peopleCostPercent = form.watch('people_cost_percent');

  useEffect(() => {
    if (lastChanged !== 'people_cost' || !projectCost || peopleCost === undefined) {
      return;
    }

    const percent = (peopleCost / projectCost) * 100;

    form.setValue('people_cost_percent', Number(percent.toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [peopleCost, projectCost, lastChanged]);

  useEffect(() => {
    if (lastChanged !== 'people_cost_percent' || !projectCost || peopleCostPercent === undefined) {
      return;
    }

    const cost = (projectCost * peopleCostPercent) / 100;

    form.setValue('people_cost', Math.round(cost), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [peopleCostPercent, projectCost, lastChanged]);

  return (
    <Form {...form}>
      <form id="project-create-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 px-5">
          <div>
            <h2 className="font-medium text-lg mb-0">ข้อมูลโครงการ</h2>
            <hr className="mt-2 mb-5" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-8 pb-10">
              <div className="flex flex-wrap items-baseline">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>
                        รหัสโครงการ
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="รหัสโครงการ"
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>
                        ชื่อโครงการ
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ชื่อโครงการ"
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
              <div className="flex flex-wrap items-baseline">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>
                        วันที่เริ่มต้น
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <DatePickerInput
                          value={field.value}
                          placeholder="วันที่เริ่มต้นโครงการ"
                          isError={form.formState.errors.start_date ? true : false}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>
                        วันที่สิ้นสุด
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <DatePickerInput
                          value={field.value || undefined}
                          placeholder="วันที่สิ้นสุดโครงการ"
                          isError={form.formState.errors.start_date ? true : false}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap items-baseline">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>
                        สถานะโครงการ
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <ComboboxForm
                          placeholder="เลือกสถานะ"
                          options={projectStatusOptions ?? []}
                          field={field}
                          onSelect={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>
                        มูลค่าโครงการ
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="มูลค่าโครงการ"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : e.target.valueAsNumber
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap items-baseline">
                <FormField
                  control={form.control}
                  name="people_cost"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>งบประมาณบุคลากรสำหรับโครงการ (บาท)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="งบประมาณบุคลากรสำหรับโครงการ"
                          {...field}
                          onChange={(e) => {
                            setLastChanged('people_cost');
                            field.onChange(
                              e.target.value === '' ? undefined : e.target.valueAsNumber
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="people_cost_percent"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>สัดส่วนงบประมาณบุคลากร (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="สัดส่วนงบประมาณบุคลากร"
                          {...field}
                          onChange={(e) => {
                            setLastChanged('people_cost_percent');
                            field.onChange(
                              e.target.value === '' ? undefined : e.target.valueAsNumber
                            );
                          }}
                        />
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
                          placeholder="คำอธิบาย"
                          {...field}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-lg mb-0">สมาชิก</h2>
            <hr className="mt-2 mb-5" />
            <ProjectMemberTable
              form={form}
              teamOptions={teamOptions}
              header={headersTableMember}
              userOptions={userOptions}
            />
            <div className="flex w-full py-4 px-2">
              <Button type="button" onClick={handleAddMember}>
                เพิ่มข้อมูล
              </Button>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-lg mb-0">ประเภทงานตั้งต้น</h2>
            <hr className="mt-2 mb-5" />
            <ProjectTaskTable form={form} header={headersTableTask} name="main_task_type" />
            <div className="flex w-full py-4 px-2">
              <Button type="button" onClick={handleAddMainTaskType}>
                เพิ่มข้อมูล
              </Button>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-lg mb-0">ประเภทงานจำเพาะ</h2>
            <hr className="mt-2 mb-5" />
            <ProjectTaskTable form={form} header={headersTableTask} name="optional_task_type" />
            <div className="flex w-full py-4 px-2">
              <Button type="button" onClick={handleAddOptionalTaskType}>
                เพิ่มข้อมูล
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
export default ProjectCreate;
