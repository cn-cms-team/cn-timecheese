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
import { useForm } from 'react-hook-form';
import { createRoleSchema, CreateRoleSchemaType } from './schema';
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
import { IRole, IRolePermissions } from '@/types/setting/role';

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
  const fetchRolesUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/setting/role/new`;
  const schema = createRoleSchema;
  const getRolesPermission = async () => {
    const response = await fetch(fetchRolesUrl);
    const result = await response.json();
    setPermissions(result.data.permissions);
    console.log('result.data', result);
  };
  const [permissions, setPermissions] = React.useState<IRole[]>([]);

  useEffect(() => {
    getRolesPermission();
  }, []);

  const form = useForm<CreateRoleSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const headers = [
    { label: 'เมนู', className: 'w-[700px] text-left' },
    ...['ทั้งหมด', 'ดูรายละเอียด', 'สร้าง', 'แก้ไข', 'ลบ', 'นำออกข้อมูล'].map((label) => ({
      label,
      className: 'text-center',
    })),
  ];
  const checkBoxColumnKey = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'EXPORT'];

  return (
    <div className="flex flex-col px-5">
      <h2 className='font-medium text-lg mb-0"'>ข้อมูลสิทธิ์การใช้งาน</h2>
      <hr className="mt-2 mb-5" />
      <Form {...form}>
        <form id="role-create-form" className="grid grid-cols-1">
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
            <h2 className="font-medium text-lg mb-0 mt-5">ตั้งค่าสิทธิ์การใช้งาน</h2>
            <hr className="mt-2 mb-5" />
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
                        {permissions?.map((permissions) => {
                          return (
                            <React.Fragment key={permissions.code}>
                              <TableRow>
                                <TableCell>{permissions.name}</TableCell>
                              </TableRow>
                            </React.Fragment>
                          );
                        })}
                        <TableRow>
                          <TableCell></TableCell>
                        </TableRow>
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
