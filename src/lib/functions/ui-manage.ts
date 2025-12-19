import { IMenu, IMenuId } from '@/types/menu';
import { IPermissionId } from '@/types/permission';
import { EModules } from '../constants/module';
import { Account } from '@/components/context/app-context';

export const isMenubarActive = (url: string, pathname: string): boolean => {
  if (url === '/') {
    return url === pathname;
  }
  return pathname.startsWith(url);
};

export const isMenubarActiveInCollapsible = (
  items: { url: string }[],
  pathname: string
): boolean => {
  return items.some((item) => isMenubarActive(item.url, pathname));
};

export const filterMenuByPermission = (
  menu: IMenu[],
  permission: Record<IMenuId, IPermissionId[]>
): IMenu[] => {
  return menu.filter((menu: IMenu) => {
    if (menu.items && menu.items.length > 0) {
      return (menu.items = filterMenuByPermission(menu.items, permission));
    }
    return Object.keys(permission).includes(menu.menuId || '');
  });
};

export const renderByPermission = (
  account: Account | null,
  menu: EModules,
  permission_id: IPermissionId
) => {
  if (!account) return false;
  return account.permissions?.[menu as IMenuId]?.includes(permission_id) || false;
};
