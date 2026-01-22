'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  SortColumn,
  ActionColumn,
  ButtonEdit,
  ButtonDelete,
} from '@/components/ui/custom/data-table';
import LinkTable from '@/components/ui/custom/data-table/link';
import { IPosition } from '@/types/setting/position';
import { useState, useRef } from 'react';
import { Account } from '@/components/context/app-context';
import { renderByPermission } from '@/lib/functions/ui-manage';
import { EModules } from '@/lib/constants/module';

const positionNameColumn = SortColumn<IPosition>('name', 'ชื่อตำแหน่ง');
const descriptionColumn = SortColumn<IPosition>('description', 'คำอธิบาย');
const usedCountColumn = SortColumn<IPosition>('used_count', 'จำนวนผู้ใช้งาน', 'center');
const actionColumn = ActionColumn<IPosition>('actions', 'จัดการ');

type createColumnsProps = {
  account: Account;
  onOpenDialog: (mode: 'edit' | 'delete', id: string, data: { name: string }) => void;
};

export const createColumns = ({
  account,
  onOpenDialog,
}: createColumnsProps): ColumnDef<IPosition>[] => {
  const baseColumns: ColumnDef<IPosition>[] = [
    {
      ...positionNameColumn,
      size: 100,
      cell: ({ row }) => {
        const { name, id } = row.original;
        const viewLink = `/setting/position/${id}`;
        return <LinkTable path={viewLink}>{name}</LinkTable>;
      },
    },
    {
      ...descriptionColumn,
      size: 200,
      cell: ({ row }) => {
        const description = (row.original.description as string) || '-';
        const [isOverflow, setIsOverflow] = useState(false);
        const textRef = useRef<HTMLDivElement>(null);

        const handleMouseEnter = () => {
          if (textRef.current) {
            setIsOverflow(textRef.current.scrollWidth > textRef.current.clientWidth);
          }
        };
        return (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild onMouseEnter={handleMouseEnter}>
                <div ref={textRef} className="truncate w-fit max-w-[500px] cursor-help">
                  {description}
                </div>
              </TooltipTrigger>
              {isOverflow && (
                <TooltipContent className="max-w-[500px]">
                  <p>{description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      ...usedCountColumn,
      size: 100,
      cell: ({ row }) => {
        const { used_count } = row.original;
        return <div className="text-center">{used_count || '-'}</div>;
      },
    },
  ];

  const canEdit = renderByPermission(account, EModules.ADMIN_POSITION, 'EDIT');
  const canDelete = renderByPermission(account, EModules.ADMIN_POSITION, 'DELETE');
  if (canEdit || canDelete) {
    return [
      ...baseColumns,
      {
        ...actionColumn,
        cell: ({ row }) => {
          const { id, name } = row.original;

          return (
            <div className="flex justify-center gap-2">
              {canEdit && <ButtonEdit onClick={() => onOpenDialog('edit', id, { name })} />}
              {canDelete && (
                <ButtonDelete
                  onOpenDialog={() => onOpenDialog('delete', id, { name })}
                  id={id}
                  data={{ name }}
                />
              )}
            </div>
          );
        },
      },
    ];
  }
  return baseColumns;
};
