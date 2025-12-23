'use client';
import { notFound, usePathname } from 'next/navigation';

import { ApiResponse } from '@/lib/fetcher';
import { IMenuId } from '@/types/menu';
import { IPermissionId } from '@/types/permission';
import { signOut, useSession } from 'next-auth/react';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { menuItems } from '@/lib/constants/menu';
import { EPermissions } from '@/lib/constants/pms';

export type Account = {
  user_id: string | null;
  permissions: Record<IMenuId, IPermissionId[]> | null;
  name?: string | null;
  reset_password_date?: Date | null;
  last_login_at?: Date | null;
  position_level?: string | null;
};

type AppContextType = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  account: Account;
  setAccount: (value: Account) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account>({
    user_id: null,
    permissions: null,
    reset_password_date: null,
    name: null,
    position_level: null,
    last_login_at: null,
  });

  useEffect(() => {
    const getAccount = async () => {
      const result = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/account`);
      if (result.ok) {
        const data: ApiResponse<Account> = await result.json();
        const { user_id, permissions, reset_password_date, name, position_level, last_login_at } =
          data.data;
        const resetPasswordDateSession = session?.user?.resetPasswordDate || '';
        const resetPasswordDateAccount = reset_password_date || '';
        if (!user_id || resetPasswordDateSession !== resetPasswordDateAccount) {
          signOut();
        }
        if (user_id && permissions) {
          setAccount({
            user_id,
            permissions,
            name,
            position_level,
          });
        }

        if (
          resetPasswordDateSession == null &&
          resetPasswordDateSession == '' &&
          !pathname.includes('reset-password')
        ) {
          // redirect to change password page
          window.location.href = `/setting/user/${user_id}/reset-password`;
        }
        const lastLoginAt = session?.user?.lastLoginAt || '';
        if (lastLoginAt && lastLoginAt !== last_login_at) {
          signOut();
        }
      }
    };

    getAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!account.permissions) return;
    const permission = account.permissions;
    const menu = menuItems.flatMap((menu) => (menu.items ? menu.items : menu));
    const accessMenu = menu.find((e) => pathname.includes(e.url));
    if (accessMenu) {
      const permissionMenu = permission?.[`${accessMenu.menuId!}`] as IPermissionId[];
      const permissionAccess = pathname.includes('new')
        ? EPermissions.CREATE
        : pathname.includes('edit')
        ? EPermissions.EDIT
        : EPermissions.VIEW;

      const canAccess = permissionMenu ? permissionMenu.includes(permissionAccess) : false;
      if (!canAccess) {
        notFound();
      }
    }
  }, [pathname, account.permissions]);

  return (
    <AppContext.Provider value={{ isLoading, setIsLoading, account, setAccount }}>
      {children}
    </AppContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useLoading must be used within a AppProvider');
  }
  return context;
};

export const useAccount = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};
