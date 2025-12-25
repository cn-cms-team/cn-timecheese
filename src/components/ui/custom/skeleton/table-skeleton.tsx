import { Skeleton } from '../../skeleton';

const TableSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-8 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="flex flex-col gap-5">
        {Array.from({ length: 8 }).map((_, idx1) => (
          <div key={idx1} className="mb-2 flex gap-4">
            <Skeleton className="h-5 w-full animate-pulse rounded-md bg-gray-200" />
            <Skeleton className="h-5 w-full animate-pulse rounded-md bg-gray-200 hidden md:block" />
            <Skeleton className="h-5 w-full animate-pulse rounded-md bg-gray-200 hidden md:block" />
            <Skeleton className="h-5 w-full animate-pulse rounded-md bg-gray-200 hidden md:block" />
            <Skeleton className="h-5 w-full animate-pulse rounded-md bg-gray-200 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default TableSkeleton;
