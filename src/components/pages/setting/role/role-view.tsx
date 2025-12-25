'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IRole, IRolePermissions } from '@/types/setting/role';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import LabelGroup from '@/components/ui/custom/form/label-group';
import TitleGroup from '@/components/ui/custom/cev/title-group';

const RoleViewDetail = ({ id }: { id: string }) => {
  const [role, setRole] = useState<IRole | null>(null);
  const [rolePermissions, setRolePermissions] = useState<IRolePermissions[]>([]);
  const [openRows, setOpenRows] = React.useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch(`/api/v1/setting/role/${id}`, { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          const roleData = result.data;
          setRole(roleData);
          setRolePermissions(roleData.permissions);
        }
      } catch (error) {
        console.error('Failed to fetch role data:', error);
      }
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

  const renderCheckAllView = (item: IRolePermissions) => {
    if (item.children && item.children.length > 0) {
      const childrenWithPerm = item.children.filter(
        (child) => (child.modulePermission?.length ?? 0) > 0
      );
      const allChildrenChecked = childrenWithPerm.every((child) => {
        const expectedPerms = child.modulePermission ?? [];
        const actualPerms = child.checked ?? [];
        return (
          expectedPerms.length > 0 && expectedPerms.every((perm) => actualPerms.includes(perm))
        );
      });
      return (
        <Checkbox
          className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
          checked={allChildrenChecked}
          disabled
        />
      );
    }
    const isChecked =
      (item.checked?.length ?? 0) === (item.modulePermission?.length ?? 0) &&
      (item.modulePermission?.length ?? 0) > 0;
    return (
      <Checkbox
        className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
        checked={isChecked}
        disabled
      />
    );
  };

  const renderPermissionCheckView = (item: IRolePermissions, code: string) => {
    if (!(item.modulePermission ?? []).includes(code)) return null;
    return (
      <Checkbox
        className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
        checked={item.checked?.includes(code)}
        disabled
      />
    );
  };

  const renderParentPermissionCheckView = (
    item: IRolePermissions,
    code: string,
    childPermissions: string[]
  ) => {
    if (!childPermissions.includes(code)) return null;
    const allChecked = (item.children ?? []).every((child) => {
      if (!(child.modulePermission ?? []).includes(code)) return true;
      return child.checked?.includes(code);
    });
    return (
      <Checkbox
        className="bg-white data-[state=checked]:border-[#fdc700] data-[state=checked]:bg-[#fdc700]"
        checked={allChecked}
        disabled
      />
    );
  };

  return (
    <div className="cev-box">
      <TitleGroup title="ข้อมูลสิทธิ์การใช้งาน" />
      <div className="grid grid-cols-1 gap-6">
        <LabelGroup label="ชื่อสิทธิ์การใช้งาน" value={role?.name} />
        <LabelGroup label="รายละเอียด" value={role?.description} />
      </div>
      <TitleGroup title="ตั้งค่าสิทธิ์การใช้งาน" className="mt-6" />
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/70">
            {headers.map(({ label, className }) => (
              <TableHead key={label} className={className}>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rolePermissions.map((permission) => (
            <React.Fragment key={permission.code}>
              <TableRow>
                <TableCell
                  onClick={() => toggleRow(permission.code)}
                  className={`flex items-center space-x-2 cursor-pointer 
                    ${(permission.children ?? []).length > 0 ? 'bg-[#f5f5ec]' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{permission.name}</span>
                    {(permission.children ?? []).length > 0 && (
                      <button type="button" className="flex items-center justify-center">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  className={`text-center ${
                    (permission.children ?? []).length > 0 ? 'bg-[#f5f5ec]' : ''
                  }`}
                >
                  {renderCheckAllView(permission)}
                </TableCell>
                {checkBoxColumnKey.map((code) => (
                  <TableCell
                    key={code}
                    className={`text-center ${
                      (permission.children ?? []).length > 0 ? 'bg-[#f5f5ec]' : ''
                    }`}
                  >
                    {permission.children && permission.children.length > 0
                      ? renderParentPermissionCheckView(
                          permission,
                          code,
                          getAllChildPermissions(permission)
                        )
                      : renderPermissionCheckView(permission, code)}
                  </TableCell>
                ))}
              </TableRow>

              {(permission.children ?? []).length > 0 &&
                openRows[permission.code] &&
                (permission.children ?? []).map((child) => (
                  <TableRow key={child.code}>
                    <TableCell className="px-5">{child.name}</TableCell>
                    <TableCell className="text-center">{renderCheckAllView(child)}</TableCell>
                    {checkBoxColumnKey.map((code) => (
                      <TableCell key={code} className="text-center">
                        {renderPermissionCheckView(child, code)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoleViewDetail;
