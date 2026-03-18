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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getIsCompanyProject } from '@/lib/functions/enum-mapping';

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
      is_company_project: false,
      pre_sale_code: '',
      code: '',
      name: '',
      status: '',
      description: '',
      member: [],
      main_task_type: [],
      optional_task_type: [],
    },
  });

  const isCompanyProjectWatch = form.watch('is_company_project');

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
            pre_sale_code: projectData.pre_sale_code ?? '',
            start_date: new Date(projectData.start_date),
            end_date: projectData.end_date ? new Date(projectData.end_date) : undefined,
            maintenance_start_date: projectData.maintenance_start_date
              ? new Date(projectData.maintenance_start_date)
              : undefined,
            maintenance_end_date: projectData.maintenance_end_date
              ? new Date(projectData.maintenance_end_date)
              : undefined,
            member: projectData.member.map((item) => ({
              ...item,
              project_id: id,
              day_price: item.day_price ?? 0,
              start_date: item.start_date ? new Date(item.start_date) : undefined,
              end_date: item.end_date ? new Date(item.end_date) : undefined,
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
        pre_sale_code: values.pre_sale_code,
        start_date: values.start_date,
        end_date: values.end_date,
        maintenance_start_date: values.maintenance_start_date,
        maintenance_end_date: values.maintenance_end_date,
        status: values.status,
        description: values.description,
        created_by: session?.user?.id,
        is_company_project: values.is_company_project,
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
      const result = await response.json();
      if (response.ok) {
        if (result.message) {
          toast.success(result.message);
        }
        router.push('/setting/project');
      } else {
        toast.warning(result.message || 'An unexpected error occurred. Please try again.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const headersTableMember = [
    { label: 'ชื่อ-นามสกุล', className: 'text-center min-w-60 max-w-60' },
    { label: 'ตำแหน่ง', className: 'text-center min-w-60 max-w-60' },
    { label: 'วันที่เข้าร่วม', className: 'text-center min-w-60 max-w-60' },
    { label: 'วันที่สิ้นสุด', className: 'text-center min-w-60 max-w-60' },
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
    is_using: false,
  };

  const handleAddMember = () => {
    form.setValue('member', [...form.getValues('member'), defaultMemberDetail]);
  };

  const handleAddOptionalTaskType = () => {
    form.setValue('optional_task_type', [...form.getValues('optional_task_type'), defaultTaskType]);
  };

  return (
    <div className="cev-box">
      <Form {...form}>
        <form id="project-create-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div>
              <TitleGroup title="ข้อมูลโครงการ" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_company_project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ประเภทโครงการ</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-readonly
                            id="is-company-project"
                            disabled={id ? true : false}
                          />
                          <Label htmlFor="is-company-project" className="mb-0">
                            {getIsCompanyProject(isCompanyProjectWatch as boolean)}
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pre_sale_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัส Pre-Sale</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="รหัส Pre-Sale"
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        วันที่เริ่มต้นโครงการ
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
                    <FormItem>
                      <FormLabel>วันที่สิ้นสุดโครงการ</FormLabel>
                      <FormControl>
                        <DatePickerInput
                          {...field}
                          value={field.value ? new Date(field.value) : undefined}
                          placeholder="วันที่สิ้นสุดโครงการ"
                          isError={form.formState.errors.start_date ? true : false}
                          onChange={field.onChange}
                          allowClear
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maintenance_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>วันที่เริ่มต้นการบำรุงรักษา</FormLabel>
                      <FormControl>
                        <DatePickerInput
                          {...field}
                          value={field.value ? new Date(field.value) : undefined}
                          placeholder="วันที่เริ่มต้นการบำรุงรักษา"
                          isError={form.formState.errors.maintenance_start_date ? true : false}
                          onChange={field.onChange}
                          allowClear
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maintenance_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>วันที่สิ้นสุดการบำรุงรักษา</FormLabel>
                      <FormControl>
                        <DatePickerInput
                          {...field}
                          value={field.value ? new Date(field.value) : undefined}
                          placeholder="วันที่สิ้นสุดการบำรุงรักษา"
                          isError={form.formState.errors.maintenance_end_date ? true : false}
                          onChange={field.onChange}
                          allowClear
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>คำอธิบาย</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="คำอธิบาย"
                          maxLength={MAX_LENGTH_255}
                          {...field}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          showMaxLengthCounter
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {!isCompanyProjectWatch && (
              <div>
                <TitleGroup title="สมาชิก" />
                <ProjectMemberTable
                  form={form}
                  header={headersTableMember}
                  userOptions={userOptions}
                />
                <div className="flex w-full py-4 px-2">
                  <Button type="button" onClick={handleAddMember}>
                    เพิ่มข้อมูล
                  </Button>
                </div>
              </div>
            )}
            <div>
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
            <div>
              <TitleGroup title="ประเภทงานจำเพาะ" />
              <ProjectTaskTable
                form={form}
                header={headersTableTask}
                taskOption={taskOptions}
                typeOption={taskTypeOption}
                name="optional_task_type"
              />
              <div className="flex w-full py-4 px-2">
                <Button type="button" onClick={handleAddOptionalTaskType}>
                  เพิ่มข้อมูล
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default ProjectCreate;
