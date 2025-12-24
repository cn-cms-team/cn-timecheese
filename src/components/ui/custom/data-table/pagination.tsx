import { Table } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { numberWithCommas } from '@/lib/functions/number-format';
import { useState } from 'react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export default function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const getPaginationRange = (currentPage: number, pageCount: number): (number | string)[] => {
    const DOTS = '...';
    const firstPageIndex = 1;
    const lastPageIndex = pageCount;

    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, DOTS, pageCount];
    }

    if (currentPage >= pageCount - 3) {
      return [1, DOTS, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
    }

    return [
      firstPageIndex,
      DOTS,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      DOTS,
      lastPageIndex,
    ];
  };

  const paginationRange = getPaginationRange(currentPage + 1, pageCount);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between mt-3 gap-4 lg:gap-3 text-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <p className="font-medium text-muted-foreground">แสดง</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPageSize(Number(value));
            }}
            open={open}
            onOpenChange={setOpen}
          >
            <SelectTrigger className="data-[size=default]:h-7 w-[75px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-nowrap w-fit font-medium text-muted-foreground">
          {`${numberWithCommas(
            table.getRowModel().rows.length === 0
              ? 0
              : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
          )}
          - ${numberWithCommas(
            Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )
          )}
          จาก ${numberWithCommas(table.getFilteredRowModel().rows.length ?? 0)}`}
        </div>
      </div>
      <div className="flex items-center space-x-2 lg:ms-auto">
        <Button
          variant="outline"
          className="h-7 w-7 p-0 border-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>

        {paginationRange.map((page, index) => {
          if (page === '...') {
            return (
              <div key={index} className="px-2 h-7 flex align-middle text-gray-500 font-bold">
                ...
              </div>
            );
          }

          const pageIndex = (page as number) - 1;

          return (
            <Button
              key={index}
              variant="ghost"
              className={`h-7 w-fit min-w-7 py-0 px-1 text-center font-normal border-1 rounded-lg ${
                pageIndex === currentPage ? 'border-neutral-500 text-neutral-500' : ''
              }`}
              onClick={() => table.setPageIndex(pageIndex)}
            >
              {numberWithCommas(Number(page) ?? 0)}
            </Button>
          );
        })}

        <Button
          variant="outline"
          className="h-7 w-7 p-0 bg-white"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
      </div>
      <div className="flex flex-nowrap items-center">
        <div className="me-3 text-muted-foreground">ไปที่หน้า</div>
        <input
          className="border-1 w-[50px] h-7 rounded-lg px-2"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          onInput={(e) => {
            const input = e.currentTarget;
            input.value = input.value.replace(/[^0-9]/g, '');
            input.onkeydown = (event) => {
              if (event.key === 'Enter') {
                const value = Number(input.value);
                if (!value || value < 1 || value > pageCount) {
                  input.value = '';
                  table.setPageIndex(pageCount - 1);
                } else {
                  table.setPageIndex(value - 1);
                }
                input.blur();
              }
            };
          }}
        />
      </div>
    </div>
  );
}
