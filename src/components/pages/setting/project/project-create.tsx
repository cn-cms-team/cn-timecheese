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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getIsActive, getProjectStatus } from '@/lib/functions/enum-mapping';
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

const ProjectCreate = ({ id }: { id?: string }): React.ReactNode => {
  const { data: session } = useSession();
  const router = useRouter();

  const [teamOptions, setTeamOptions] = useState<IOptions[]>([]);
  const [getConfirmation, Confirmation] = useDialogConfirm();

  const schema = id ? editProjectSchema : createProjectSchema;
  const form = useForm<EditProjectSchemaType | CreateProjectSchemaType>({
    resolver: zodResolver(schema),
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
        const [team] = await Promise.all([fetcher<IOptions[]>(`${prefix}/api/v1/master/team`)]);
        setTeamOptions(team);
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
        created_by: session?.user?.id,
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
    { label: 'ทีม', className: 'text-center min-w-20' },
    { label: 'ชื่อ-นามสกุล', className: 'text-center min-w-20' },
    { label: 'ตำแหน่ง', className: 'text-center' },
    { label: 'ค่าใช้จ่ายต่อวัน', className: 'text-center' },
    { label: 'วันที่เข้าร่วม', className: 'text-center' },
    { label: 'วันที่สิ้นสุด', className: 'text-center' },
    { label: 'จำนวนวัน', className: 'text-center' },
    { label: 'ค่าใช้จ่ายโดยประมาณ', className: 'text-center' },
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
    position: '',
    day_price: 0,
    start_date: null!,
    end_date: null!,
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

  const EmptyTable = () => {
    return <div className="flex justify-center items-center p-4">ไม่มีข้อมูล</div>;
  };

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
                          placeholder="กรุณากรอกรหัสโครงการ"
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
                          placeholder="กรุณากรอกชื่อโครงการ"
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
                          placeholder="กรุณาเลือกวันที่เริ่มต้นของคุณ"
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
                          placeholder="กรุณาเลือกวันที่สิ้นสุดของคุณ"
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
                  name="value"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel>
                        มูลค่าโครงการ
                        <Required />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="กรุณากรอกมูลค่าโครงการ"
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
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-lg mb-0">สมาชิก</h2>
            <hr className="mt-2 mb-5" />
            <ProjectMemberTable form={form} teamOptions={teamOptions} header={headersTableMember} />
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
