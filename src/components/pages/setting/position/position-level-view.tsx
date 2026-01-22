import DataTable from '@/components/ui/custom/data-table/table-template';
import { IPositionLevel } from '@/types/setting/position';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface IProps<TData, TValue> {
  levels: IPositionLevel[];
  columns: ColumnDef<TData, TValue>[];
}

const PositionLevelView = <TData, TValue>({ levels, columns }: IProps<TData, TValue>) => {
  const table = useReactTable({
    data: levels as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return <DataTable table={table} columns={columns} />;
};
export default PositionLevelView;
