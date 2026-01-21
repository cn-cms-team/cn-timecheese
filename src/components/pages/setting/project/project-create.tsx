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
import { DatePickerInput } from '@/components/ui/custom/input/date-picker';
import { useSession } from 'next-auth/react';
import Required from '@/components/ui/custom/form/required';
import { Button } from '@/components/ui/button';
import useDialogConfirm from '@/hooks/use-dialog-confirm';
import { projectStatusOptions } from '@/lib/constants/select-options';
import ProjectMemberTable from './project-member-table';
import ProjectTaskTable from './project-task-table';
import { IProject, TaskOptions, UserInfo } from '@/types/setting/project';
import { Textarea } from '@/components/ui/textarea';
import { TitleGroup } from '@/components/ui/custom/cev';
import { taskTypeOption } from '@/lib/constants/task';
import { toast } from 'sonner';
import { IOptionGroups } from '@/types/dropdown';
import { MAX_LENGTH_25, MAX_LENGTH_255 } from '@/lib/constants/validation';
import { ModalAddMultipleTask } from './modal-add-multiple-task';
import { useLoading } from '@/components/context/app-context';

const ProjectCreate = ({ id }: { id?: string }): React.ReactNode => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setIsLoading } = useLoading();
  const [userOptions, setUserOptions] = useState<IOptionGroups[]>([]);
  const [taskOptions, setTaskOptions] = useState<TaskOptions[]>([]);
  const [getConfirmation, Confirmation] = useDialogConfirm();
  const [open, setOpen] = useState(false);

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
        const [user, task] = await Promise.all([
          fetcher<IOptionGroups[]>(`${prefix}/api/v1/master/user`),
          fetcher<TaskOptions[]>(`${prefix}/api/v1/master/task-type`),
        ]);
        setUserOptions(user);
        setTaskOptions(task);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchTeamsOptions();
  }, []);

  useEffect(() => {
    const fetchProjectData = async (projectId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/setting/project/${projectId}`, { method: 'GET' });
        const result = await response.json();
        if (response.ok) {
          const projectData = result.data as IProject;
          form.reset({
            ...projectData,
            start_date: new Date(projectData.start_date),
            end_date: new Date(projectData.end_date),
            member: projectData.member.map((item) => ({
              ...item,
              project_id: id,
              day_price: item.day_price ?? 0,
              start_date: new Date(item.start_date),
              end_date: new Date(item.end_date),
            })),
          });
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchProjectData(id);
    }
  }, []);

  const onSubmit = async (values: CreateProjectSchemaType | EditProjectSchemaType) => {
    try {
      setIsLoading(true);
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
          project_id: id,
          day_price: item.day_price ?? 0,
          work_hours: item.work_day ? item.work_day * 8 : 0,
          hour_price: item.day_price ? item.day_price / 8 : 0,
        })),
        main_task_type: values.main_task_type,
        optional_task_type: values.optional_task_type,
        updated_by: id ? session?.user.id : null,
      };
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        const result = await response.json();
        toast(result.message);
        router.push('/setting/project');
      }
    } catch {
      console.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const headersTableMember = [
    { label: 'ชื่อ-นามสกุล', className: 'text-center min-w-60 max-w-60' },
    { label: 'ตำแหน่ง', className: 'text-center min-w-60 max-w-60' },
    { label: 'ค่าใช้จ่ายต่อวัน', className: 'text-center min-w-60 max-w-60' },
    { label: 'วันที่เข้าร่วม', className: 'text-center min-w-60 max-w-60' },
    { label: 'วันที่สิ้นสุด', className: 'text-center min-w-60 max-w-60' },
    { label: 'จำนวนวัน', className: 'text-center min-w-20 max-w-20' },
    { label: 'ค่าใช้จ่ายโดยประมาณ', className: 'text-center min-w-60 max-w-60' },
    { label: '', className: 'text-center' },
  ];

  const headersTableTaskMain = [
    { label: 'หมวดหมู่', className: 'text-center min-w-20' },
    { label: 'ประเภทงาน', className: 'text-center min-w-20' },
    { label: '', className: 'text-center' },
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
    is_using: false,
  };

  const defaultTaskType = {
    task_type_id: '',
    type: '',
    name: '',
    description: '',
  };

  const handleAddMember = () => {
    form.setValue('member', [...form.getValues('member'), defaultMemberDetail]);
  };

  const handleAddOptionalTaskType = () => {
    form.setValue('optional_task_type', [...form.getValues('optional_task_type'), defaultTaskType]);
  };

  const [lastChanged, setLastChanged] = useState<'people_cost' | 'people_cost_percent' | null>(
    null
  );

  const projectCost = form.watch('value') ?? 0;
  const peopleCost = form.watch('people_cost') ?? 0;
  const peopleCostPercent = form.watch('people_cost_percent') ?? 0;
  const formMember = form.watch('member');
  const allMemberCost = formMember.reduce((acc, cur) => acc + (cur.estimated_cost ?? 0), 0);

  useEffect(() => {
    if (lastChanged !== 'people_cost' || !projectCost || peopleCost === undefined) {
      return;
    }

    const percent = (peopleCost! / projectCost) * 100;

    form.setValue('people_cost_percent', Number(percent.toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [peopleCost, projectCost, lastChanged]);

  useEffect(() => {
    if (lastChanged !== 'people_cost_percent' || !projectCost || peopleCostPercent === undefined) {
      return;
    }

    const cost = (projectCost * peopleCostPercent!) / 100;

    form.setValue('people_cost', Math.round(cost), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [peopleCostPercent, projectCost, lastChanged]);

  return (
    <div className="cev-box">
      <Form {...form}>
        <form id="project-create-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 px-5">
            <div className="lg:col-span-2">
              <TitleGroup title="ข้อมูลโครงการ" />
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
                            maxLength={MAX_LENGTH_25}
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
                            {...field}
                            value={new Date(field.value)}
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
                            {...field}
                            value={new Date(field.value)}
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
                            isError={form.formState.errors.status ? true : false}
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
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(e.target.value === '' ? '' : e.target.valueAsNumber)
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
                            value={field.value ?? ''}
                            onChange={(e) => {
                              setLastChanged('people_cost');
                              field.onChange(e.target.value === '' ? '' : e.target.valueAsNumber);
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
                            {...field}
                            value={field.value ?? ''}
                            placeholder="สัดส่วนงบประมาณบุคลากร"
                            onChange={(e) => {
                              setLastChanged('people_cost_percent');
                              field.onChange(e.target.value === '' ? '' : e.target.valueAsNumber);
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
                            maxLength={MAX_LENGTH_255}
                            {...field}
                            value={field.value ?? ''}
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
            <div className="lg:col-span-2">
              <TitleGroup title="สมาชิก" />
              <ProjectMemberTable
                form={form}
                header={headersTableMember}
                userOptions={userOptions}
              />
              <div className="flex w-full py-4 px-2">
                <Button onClick={handleAddMember}>เพิ่มข้อมูล</Button>
              </div>
            </div>
            <div className="md:col-span-1">
              <TitleGroup title="ประเภทงานตั้งต้น" />
              <ProjectTaskTable
                form={form}
                header={headersTableTaskMain}
                taskOption={taskOptions}
                typeOption={taskTypeOption}
                name="main_task_type"
              />
              <div className="flex w-full py-4 px-2">
                <ModalAddMultipleTask
                  form={form}
                  taskOption={taskOptions}
                  typeOption={taskTypeOption}
                  open={open}
                  onOpenChange={setOpen}
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <TitleGroup title="ประเภทงานจำเพาะ" />
              <ProjectTaskTable
                form={form}
                header={headersTableTask}
                taskOption={taskOptions}
                typeOption={taskTypeOption}
                name="optional_task_type"
              />
              <div className="flex w-full py-4 px-2">
                <Button onClick={handleAddOptionalTaskType}>เพิ่มข้อมูล</Button>
              </div>
            </div>
            <div className="flex justify-end font-bold lg:col-span-2">
              <div className="flex flex-col w-[50%] lg:w-[25%]">
                <div className="flex justify-between py-1 text-blue-600">
                  <div>มูลค่าบุคลากรที่ตั้งไว้</div>
                  <div>{peopleCost.toLocaleString() ?? 0}</div>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between py-1 text-blue-600">
                  <div>มูลค่าบุคลากรที่เลือก</div>
                  <div>{allMemberCost.toLocaleString() ?? 0}</div>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between py-1">
                  <div>มูลค่าแตกต่าง</div>
                  <div className={peopleCost - allMemberCost < 0 ? 'text-red-500' : ''}>
                    {(peopleCost - allMemberCost).toLocaleString()}
                  </div>
                </div>
                <hr className="my-1" />
                <hr className="my-1" />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ProjectCreate;
