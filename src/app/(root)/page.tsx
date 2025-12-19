'use client';

import { redirect } from 'next/navigation';

import { filterMenuByPermission } from '@/lib/functions/ui-manage';
import { menuItems } from '@/lib/constants/menu';
import { IMenuId } from '@/types/menu';
import { IPermissionId } from '@/types/permission';
import { useAccount } from '@/components/context/app-context';

const HomePage = () => {
  const { account } = useAccount();
  const menuItemsClone = menuItems.map((item) => ({ ...item }));
  const menuPermission = account?.permissions
    ? filterMenuByPermission(
        menuItemsClone,
        account?.permissions as Record<IMenuId, IPermissionId[]>
      )
    : [];
  if (menuPermission && menuPermission.length > 0) {
    const path =
      menuPermission[0].items && menuPermission[0].items.length > 0
        ? menuPermission[0].items[0].url
        : menuPermission[0].url;
    redirect(path);
  }
  return <div />;
};

export default HomePage;
