import { ColumnDef, Table, flexRender } from '@tanstack/react-table';
import Image from 'next/image';

import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from './pagination';

interface TableTemplateProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  isShowHeader?: boolean;
  isPagination?: boolean;
  loading?: boolean;
}
export default function DataTable<TData, TValue>({
  table,
  columns,
  isShowHeader = true,
  isPagination = true,
  loading = false,
}: TableTemplateProps<TData, TValue>) {
  return (
    <>
      <div>
        <TableUI>
          {isShowHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table.getRowModel() && table.getRowModel().rows && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="truncate"
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col justify-center items-center min-h-[300px]">
                    <Image
                      src="/no-data.svg"
                      width={150}
                      height={150}
                      alt="Nodata"
                      className="mx-auto"
                    />
                    <span className="text-[#98A2B3] mt-3">ไม่พบข้อมูล</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>
      {isPagination && (
        <div className="mt-2">
          <Pagination table={table} />
        </div>
      )}
    </>
  );
}
