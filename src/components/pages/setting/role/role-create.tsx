'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IRolePermissions } from '@/types/setting/role';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { createEditRoleSchema, CreateEditRoleSchemaType } from './schema';
import { useRouter } from 'next/navigation';
import TitleGroup from '@/components/ui/custom/cev/title-group';

type OutputItem = {
  code: string;
  checked: string[];
};

function transformData(data: IRolePermissions[]): OutputItem[] {
  const result: OutputItem[] = [];

  const flatten = (item: IRolePermissions) => {
    result.push({
      code: item.code,
      checked: item.checked || [],
    });

    if (item.children && item.children.length > 0) {
      item.children.forEach(flatten);
    }
  };

  data.forEach(flatten);
  return result;
}

const RoleCreate = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [rolePermissions, setRolePermissions] = React.useState<IRolePermissions[]>([]);
  const [openRows, setOpenRows] = React.useState<Record<string, boolean>>({});
  const isEdit = !!id;
  // const { data: session } = useSession();
  // if (!session) {
  //   throw new Error('Unauthorized');
  // }

  const form = useForm({
    resolver: zodResolver(createEditRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  useEffect(() => {
    const fetchRole = async () => {
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role/${id}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role/new`;

      const res = await fetch(url);
      const result = await res.json();
      const data = result.data;

      setRolePermissions(data.permissions ?? []);

      form.reset({
        name: data.name ?? '',
        description: data.description ?? '',
        permissions: transformData(data.permissions ?? []),
      });
    };

    fetchRole();
  }, [id]);

  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    rolePermissions.forEach((item) => {
      initialOpenState[item.code] = true;
    });
    setOpenRows(initialOpenState);
  }, [rolePermissions]);

  const onSubmit = async (values: CreateEditRoleSchemaType) => {
    try {
      let fetchUrl = '/api/v1/setting/role';
      if (id) {
        fetchUrl = `/api/v1/setting/role/${id}`;
      }
      const data = {
        name: values.name,
        description: values.description,
        permissions: values.permissions,
        // created_by: session.user?.id as String,
      };
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        router.push('/setting/role');
      }
    } catch (err) {
      console.error('Error saving role:', err);
    } finally {
      console.log('Finally block executed');
    }
  };

  const headers = [
    { label: 'เมนู', className: 'w-[700px] text-left' },
    ...['ทั้งหมด', 'ดูรายละเอียด', 'สร้าง', 'แก้ไข', 'ลบ', 'นำออกข้อมูล'].map((label) => ({
      label,
      className: 'text-center',
    })),
  ];

  const checkBoxColumnKey = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'];

  function toggleRow(code: string) {
    setOpenRows((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  function getAllChildPermissions(item: IRolePermissions) {
    const perms = new Set<string>();
    (item.children ?? []).forEach((child) => {
      (child.modulePermission ?? []).forEach((p) => perms.add(p));
    });
    return Array.from(perms);
  }

  const toggleCheckAll = (item: IRolePermissions, checked: boolean) => {
    const inputPermission = [...(form.getValues('permissions') ?? [])];
    const allModule = [item, ...(item.children ?? [])];
    const uniquePermissions = Array.from(new Set(allModule?.flatMap((x) => x.modulePermission)));
    if (item.children && item.children.length > 0) {
      const children = item.children;
      const allPermissionsFromChildren = Array.from(
        new Set(children.flatMap((child) => child.modulePermission ?? []))
      );

      const parent = inputPermission.find((p) => p.code === item.code);
      if (parent) {
        parent.checked = checked ? allPermissionsFromChildren : [];
      }

      children.forEach((child) => {
        const perms = child.modulePermission ?? [];
        const target = inputPermission.find((p) => p.code === child.code);
        if (target) {
          target.checked = checked ? [...perms] : [];
        }
      });
    } else {
      inputPermission
        .filter((p) => p.code === item.code)
        .forEach((perm) => {
          perm.checked = checked ? [...(uniquePermissions ?? [])] : [];
        });
    }

    form.setValue('permissions', inputPermission, { shouldDirty: true });
  };

  const updateViewPermission = (permItem: { checked: string[] }) => {
    if (!permItem.checked.includes('VIEW')) {
      permItem.checked.push('VIEW');
    }
  };

  const toggleSingleCheck = (item: IRolePermissions, code: string, checked: boolean) => {
    const inputPermission = [...(form.getValues('permissions') ?? [])];
    const updatedChecked = inputPermission.find((permission) => permission.code === item.code);

    if (!updatedChecked) return;

    if (checked) {
      if (code === 'VIEW') {
        updatedChecked.checked = ['VIEW'];
      } else {
        if (!updatedChecked.checked.includes(code)) {
          updatedChecked.checked.push(code);
        }
        updateViewPermission(updatedChecked);
      }
    } else {
      if (code === 'VIEW') {
        updatedChecked.checked = [];
      } else {
        updatedChecked.checked = updatedChecked.checked.filter((c) => c !== code);
        updateViewPermission(updatedChecked);
      }
    }

    form.setValue('permissions', inputPermission, { shouldDirty: true });
  };

  const toggleParentPermission = (item: IRolePermissions, code: string, checked: boolean) => {
    const inputPermission = [...(form.getValues('permissions') ?? [])];

    (item.children ?? []).forEach((child) => {
      if (!(child.modulePermission ?? []).includes(code)) return;

      const childPerm = inputPermission.find((p) => p.code === child.code);
      if (!childPerm) return;

      const isChecked = childPerm.checked.includes(code);

      if (checked && !isChecked) {
        childPerm.checked.push(code);
      } else if (!checked && isChecked) {
        childPerm.checked = childPerm.checked.filter((c) => c !== code);
        if (code === 'VIEW') {
          childPerm.checked = [];
        } else {
          childPerm.checked = childPerm.checked.filter((c) => c !== code);
        }
      }

      if (code !== 'VIEW') {
        updateViewPermission(childPerm);
      }
    });

    const parentPerm = inputPermission.find((p) => p.code === item.code);
    if (parentPerm) {
      const hasPermission = parentPerm.checked.includes(code);

      if (checked && !hasPermission) {
        parentPerm.checked.push(code);
      } else if (!checked && hasPermission) {
        if (code === 'VIEW') {
          parentPerm.checked = [];
        } else {
          parentPerm.checked = parentPerm.checked.filter((c) => c !== code);
        }
      }

      if (code !== 'VIEW') {
        updateViewPermission(parentPerm);
      }
    }

    form.setValue('permissions', inputPermission, { shouldDirty: true });
  };

  const renderCheckAll = (item: IRolePermissions, formPermission: OutputItem) => {
    const inputPermission = form.getValues('permissions') ?? [];
    if (item.children && item.children.length > 0) {
      const childrenWithPerm = item.children.filter(
        (child) => (child.modulePermission?.length ?? 0) > 0
      );

      const allChildrenChecked = childrenWithPerm.every((child) => {
        const found = inputPermission.find((p) => p.code === child.code);
        const expectedPerms = child.modulePermission ?? [];
        const actualPerms = found?.checked ?? [];
        return (
          expectedPerms.length > 0 && expectedPerms.every((perm) => actualPerms.includes(perm))
        );
      });

      return (
        <Checkbox
          className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
          checked={allChildrenChecked}
          onCheckedChange={(checked) => toggleCheckAll(item, !!checked)}
        />
      );
    }
    return (
      <Checkbox
        className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
        checked={formPermission.checked.length === item.modulePermission.length}
        onCheckedChange={(checked) => toggleCheckAll(item, !!checked)}
      />
    );
  };

  const renderPermissionCheck = (
    item: IRolePermissions,
    formPermission: OutputItem,
    code: string
  ) => {
    if (!(item.modulePermission ?? []).includes(code)) return null;

    return (
      <Checkbox
        className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
        checked={formPermission.checked.includes(code)}
        onCheckedChange={(checked) => toggleSingleCheck(item, code, !!checked)}
      />
    );
  };

  const renderParentPermissionCheck = (
    item: IRolePermissions,
    code: string,
    childPermissions: string[]
  ) => {
    if (!childPermissions.includes(code)) return null;
    const inputPermission = form.getValues('permissions') ?? [];
    const allChecked = (item.children ?? []).every((child) => {
      if (!(child.modulePermission ?? []).includes(code)) return true;
      const childPerm = inputPermission.find((p) => p.code === child.code);
      return childPerm?.checked.includes(code);
    });

    return (
      <Checkbox
        className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
        checked={allChecked}
        onCheckedChange={(checked) => toggleParentPermission(item, code, !!checked)}
      />
    );
  };

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลสิทธิ์การใช้งาน" />
      <Form {...form}>
        <form
          id="role-create-form"
          className="grid grid-cols-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อสิทธื์การใช้งาน</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="กรุณากรอกสิทธิ์การใช้งานของคุณ"
                      {...field}
                      onInput={(e) => {
                        field.onChange(e);
                      }}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>คำอธิบาย</FormLabel>
                  <FormControl>
                    <Textarea
                      autoComplete="off"
                      placeholder="กรุณากรอกคำอธิบายของคุณ"
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
            <TitleGroup title="ตั้งค่าสิทธิ์การใช้งาน" className="mt-6" />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormControl>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary">
                          {headers.map(({ label, className }) => (
                            <TableHead key={label} className={className}>
                              {label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rolePermissions?.map((permissions) => {
                          const formPermission = field.value?.find(
                            (p: OutputItem) => p.code === permissions.code
                          );
                          return (
                            <React.Fragment key={permissions.code}>
                              <TableRow>
                                <TableCell
                                  onClick={() => toggleRow(permissions.code)}
                                  className={`flex items-center space-x-2 cursor-pointer 
                                    ${
                                      (permissions.children ?? []).length > 0 ? 'bg-[#f5f5ec]' : ''
                                    }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span>{permissions.name}</span>
                                    {(permissions.children ?? []).length > 0 && (
                                      <button
                                        type="button"
                                        className="flex items-center justify-center"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell
                                  className={`text-center ${
                                    (permissions.children ?? []).length > 0 ? 'bg-[#f5f5ec]' : ''
                                  }`}
                                >
                                  {renderCheckAll(
                                    permissions,
                                    formPermission ?? { code: '', checked: [] }
                                  )}
                                </TableCell>
                                {(() => {
                                  const permissionsToShow =
                                    permissions.children && permissions.children.length > 0
                                      ? getAllChildPermissions(permissions)
                                      : permissions.modulePermission ?? [];
                                  return checkBoxColumnKey.map((code) => (
                                    <TableCell
                                      key={code}
                                      className={`text-center ${
                                        (permissions.children ?? []).length > 0
                                          ? 'bg-[#f5f5ec]'
                                          : ''
                                      }`}
                                    >
                                      {permissions.children && permissions.children.length > 0
                                        ? renderParentPermissionCheck(
                                            permissions,
                                            code,
                                            permissionsToShow
                                          )
                                        : renderPermissionCheck(
                                            permissions,
                                            formPermission ?? { code: '', checked: [] },
                                            code
                                          )}
                                    </TableCell>
                                  ));
                                })()}
                              </TableRow>
                              {(permissions.children ?? []).length > 0 &&
                                openRows[permissions.code] &&
                                (permissions.children ?? []).map((child) => {
                                  const childFormPermission = field.value?.find(
                                    (p: OutputItem) => p.code === child.code
                                  );
                                  return (
                                    <TableRow key={child.code}>
                                      <TableCell className="px-5">{child.name}</TableCell>
                                      <TableCell className="text-center">
                                        {renderCheckAll(
                                          child,
                                          childFormPermission ?? { code: '', checked: [] }
                                        )}
                                      </TableCell>
                                      {checkBoxColumnKey.map((code) => (
                                        <TableCell key={code} className="text-center">
                                          {renderPermissionCheck(
                                            child,
                                            childFormPermission ?? { code: '', checked: [] },
                                            code
                                          )}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoleCreate;
