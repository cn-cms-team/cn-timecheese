import { EPermissions } from '../../src/lib/constants/pms';
import { EModules } from '../../src/lib/constants/module';

export const modulePermission = [
  {
    module_code: EModules.DASHBOARD,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.TIME_SHEET,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.TIME_SHEET,
    pms_code: EPermissions.CREATE,
    order: 2,
  },
  {
    module_code: EModules.TIME_SHEET,
    pms_code: EPermissions.EDIT,
    order: 3,
  },
  {
    module_code: EModules.TIME_SHEET,
    pms_code: EPermissions.DELETE,
    order: 4,
  },
  {
    module_code: EModules.REPORT_PROJECT_STATUS,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.REPORT_PROJECT_STATUS,
    pms_code: EPermissions.EXPORT,
    order: 2,
  },
  {
    module_code: EModules.REPORT_TEAM_STATUS,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.REPORT_TEAM_STATUS,
    pms_code: EPermissions.EXPORT,
    order: 2,
  },
  {
    module_code: EModules.ADMIN_USER,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.ADMIN_USER,
    pms_code: EPermissions.CREATE,
    order: 2,
  },
  {
    module_code: EModules.ADMIN_USER,
    pms_code: EPermissions.EDIT,
    order: 3,
  },
  {
    module_code: EModules.ADMIN_USER,
    pms_code: EPermissions.DELETE,
    order: 4,
  },
  {
    module_code: EModules.ADMIN_ROLE,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.ADMIN_ROLE,
    pms_code: EPermissions.CREATE,
    order: 2,
  },
  {
    module_code: EModules.ADMIN_ROLE,
    pms_code: EPermissions.EDIT,
    order: 3,
  },
  {
    module_code: EModules.ADMIN_ROLE,
    pms_code: EPermissions.DELETE,
    order: 4,
  },
  {
    module_code: EModules.ADMIN_PROJECT,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.ADMIN_PROJECT,
    pms_code: EPermissions.CREATE,
    order: 2,
  },
  {
    module_code: EModules.ADMIN_PROJECT,
    pms_code: EPermissions.EDIT,
    order: 3,
  },
  {
    module_code: EModules.ADMIN_PROJECT,
    pms_code: EPermissions.DELETE,
    order: 4,
  },
  {
    module_code: EModules.ADMIN_TASK_TYPE,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.ADMIN_TASK_TYPE,
    pms_code: EPermissions.CREATE,
    order: 2,
  },
  {
    module_code: EModules.ADMIN_TASK_TYPE,
    pms_code: EPermissions.EDIT,
    order: 3,
  },
  {
    module_code: EModules.ADMIN_TASK_TYPE,
    pms_code: EPermissions.DELETE,
    order: 4,
  },
  {
    module_code: EModules.ADMIN_TEAM,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.ADMIN_TEAM,
    pms_code: EPermissions.CREATE,
    order: 2,
  },
  {
    module_code: EModules.ADMIN_TEAM,
    pms_code: EPermissions.EDIT,
    order: 3,
  },
  {
    module_code: EModules.ADMIN_TEAM,
    pms_code: EPermissions.DELETE,
    order: 4,
  },
  {
    module_code: EModules.ADMIN_POSITION,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.ADMIN_POSITION,
    pms_code: EPermissions.CREATE,
    order: 2,
  },
  {
    module_code: EModules.ADMIN_POSITION,
    pms_code: EPermissions.EDIT,
    order: 3,
  },
  {
    module_code: EModules.ADMIN_POSITION,
    pms_code: EPermissions.DELETE,
    order: 4,
  },
  {
    module_code: EModules.ADMIN_ACTIVITY_LOG,
    pms_code: EPermissions.VIEW,
    order: 1,
  },
  {
    module_code: EModules.ADMIN_ACTIVITY_LOG,
    pms_code: EPermissions.EXPORT,
    order: 2,
  },
];
