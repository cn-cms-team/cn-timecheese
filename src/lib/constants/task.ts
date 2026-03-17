import { IOptions } from '@/types/dropdown';
import { TaskTypeCode } from '../../../generated/prisma/enums';
import { ITaskMenu } from '@/types/setting/task-type';
import { TimelineCardTone } from '@/types/timesheet';

export const taskTypeOption: IOptions[] = [
  {
    label: 'Development',
    value: TaskTypeCode.DEVELOPMENT,
  },
  {
    label: 'Business',
    value: TaskTypeCode.BUSINESS,
  },
  {
    label: 'Information Technology',
    value: TaskTypeCode.IT,
  },
  {
    label: 'Operation',
    value: TaskTypeCode.OPERATION,
  },
  {
    label: 'Quality Assurance',
    value: TaskTypeCode.QA,
  },
  {
    label: 'Sales',
    value: TaskTypeCode.SALES,
  },
  {
    label: 'Others',
    value: TaskTypeCode.OTHER,
  },
  {
    label: 'Leave',
    value: TaskTypeCode.LEAVE,
  },
  {
    label: 'Company',
    value: TaskTypeCode.COMPANY,
  },
];

export const taskTypeMenu: ITaskMenu[] = [
  {
    id: TaskTypeCode.DEVELOPMENT,
    name: 'Development',
    description: 'Development team tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.BUSINESS,
    name: 'Business',
    description: 'Marketing team tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.IT,
    name: 'Information Technology',
    description: 'IT team tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.OPERATION,
    name: 'Operation',
    description: 'Operation team tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.QA,
    name: 'Quality Assurance',
    description: 'QA team tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.SALES,
    name: 'Sales',
    description: 'Sales team tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.COMPANY,
    name: 'Company',
    description: 'Company-wide tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.LEAVE,
    name: 'Leave',
    description: 'Leave and time off',
    is_project_task: false,
  },
  {
    id: TaskTypeCode.OTHER,
    name: 'Others',
    description: 'Other tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.HR,
    name: 'Human Resources',
    description: 'HR related tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.ACCOUNTING,
    name: 'Accounting',
    description: 'Accounting and finance tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.GRAPHIC_DESIGN,
    name: 'Graphic Design',
    description: 'Graphic design related tasks',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.MEDIA,
    name: 'Media',
    description: 'Media and content creation tasks',
    is_project_task: true,
  },
];

export const toneLabels: Record<TimelineCardTone, string> = {
  blue: 'น้ำเงิน',
  violet: 'ม่วง',
  slate: 'เทา',
  green: 'เขียว',
  red: 'แดง',
  yellow: 'เหลือง',
  orange: 'ส้ม',
};

export const toneSwatchClasses: Record<TimelineCardTone, string> = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
};
