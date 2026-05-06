import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const OKR_SKELETON_COUNT = 4;

const OKRsViewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: OKR_SKELETON_COUNT }).map((_, index) => (
        <Card key={`okr-skeleton-${index}`} className="gap-4 py-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-2 border-t">
            <Skeleton className="h-10 w-28 rounded-md" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default OKRsViewSkeleton;