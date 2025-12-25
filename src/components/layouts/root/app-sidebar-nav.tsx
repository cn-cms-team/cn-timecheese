'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isMenubarActive, isMenubarActiveInCollapsible } from '@/lib/functions/ui-manage';
import { IPermissionId } from '@/types/permission';
import { filterMenuByPermission } from '@/lib/functions/ui-manage';
import { IMenu, IMenuId } from '@/types/menu';
import { menuItems } from '@/lib/constants/menu';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAccount } from '@/components/context/app-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppSidebarNav({ openSidebar }: { openSidebar?: boolean }) {
  const pathname = usePathname();
  const { account } = useAccount();
  const [menuPermission, setMenuPermission] = useState<IMenu[]>([]);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (account?.permissions) {
      const menuItemsClone = menuItems.map((item) => ({ ...item }));
      const filterMenuPermission = account?.permissions
        ? filterMenuByPermission(
            menuItemsClone,
            account?.permissions as Record<IMenuId, IPermissionId[]>
          )
        : [];
      setMenuPermission(filterMenuPermission);
    }
  }, [account?.permissions]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menuPermission.map((item) => (
          <div key={item.name}>
            {item?.items === undefined && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
                  isActive={isMenubarActive(item.url, pathname)}
                  className={isMenubarActive(item.url, pathname) ? 'side_parent_active' : ''}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon width={28} height={28} />}
                    <span className="">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {item?.items && item.items.length > 0 && (
              <Collapsible
                key={item.name}
                asChild
                defaultOpen={isMenubarActiveInCollapsible(item.items, pathname)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <DropdownMenu
                    open={openSubmenu === item.name}
                    onOpenChange={(open) => {
                      setOpenSubmenu(open ? item.name : null);
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.name}
                          isActive={isMenubarActive(item.url, pathname)}
                          className={
                            isMenubarActive(item.url, pathname) ? 'side_parent_active' : ''
                          }
                        >
                          {item.icon && <item.icon width={28} height={28} />}
                          <span>{item.name}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </DropdownMenuTrigger>

                    {!openSidebar && (
                      <DropdownMenuContent side="right" className="flex flex-col">
                        <SidebarMenuSub className="px-0 mx-0 border-none">
                          {item.items?.map((subItem) => (
                            <DropdownMenuItem
                              key={subItem.name}
                              onClick={() => setOpenSubmenu(null)}
                            >
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isMenubarActive(subItem.url, pathname)}
                                  className={
                                    isMenubarActive(subItem.url, pathname)
                                      ? 'side_child_active'
                                      : ''
                                  }
                                >
                                  <Link href={subItem.url}>
                                    <span className="sidebar-menu-sub-item">{subItem.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </DropdownMenuItem>
                          ))}
                        </SidebarMenuSub>
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                  {openSidebar && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isMenubarActive(subItem.url, pathname)}
                              className={
                                isMenubarActive(subItem.url, pathname) ? 'side_child_active' : ''
                              }
                            >
                              <Link href={subItem.url}>
                                <span className="sidebar-menu-sub-item ">{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            )}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
