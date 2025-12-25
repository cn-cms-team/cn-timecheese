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
    description: '',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.BUSINESS,
    name: 'Business',
    description: '',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.IT,
    name: 'Information Technology',
    description: '',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.OPERATION,
    name: 'Operation',
    description: '',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.QA,
    name: 'Quality Assurance',
    description: '',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.SALES,
    name: 'Sales',
    description: '',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.COMPANY,
    name: 'Company',
    description: '',
    is_project_task: true,
  },
  {
    id: TaskTypeCode.LEAVE,
    name: 'Leave',
    description: '',
    is_project_task: false,
  },
  {
    id: TaskTypeCode.OTHER,
    name: 'Others',
    description: '',
    is_project_task: true,
  },
];
