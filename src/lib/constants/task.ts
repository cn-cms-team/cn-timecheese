import { IOptions } from '@/types/dropdown';
import { TaskTypeCode } from '../../../generated/prisma/enums';
import { ITaskMenu } from '@/types/setting/task-type';

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
    description: 'development team tasks',
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
    description: 'company-wide tasks',
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
    description: 'other tasks',
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
