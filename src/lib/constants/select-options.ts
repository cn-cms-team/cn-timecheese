import { ProjectStatus } from '../../../generated/prisma/enums';
import { getProjectStatus } from '../functions/enum-mapping';

export const projectStatusOrder: ProjectStatus[] = [
  ProjectStatus.PRE_SALE,
  ProjectStatus.PLANNING,
  ProjectStatus.IN_PROGRESS,
  ProjectStatus.ON_HOLD,
  ProjectStatus.MAINTENANCE,
  ProjectStatus.TERMINATED,
  ProjectStatus.CANCELLED,
];

export const projectStatusOptions = Object.values(ProjectStatus).map((status) => ({
  value: status,
  label: getProjectStatus(status),
}));
