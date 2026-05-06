import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const KEY_RESULT_SKELETON_COUNT = 4;

const DetailViewSkeleton = () => {
  return (
    <div className="space-y-4">
      <Card className="gap-4 py-4">
        <CardHeader className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`summary-skeleton-${index}`}
                className="rounded-lg border border-border p-4"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-8 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {Array.from({ length: KEY_RESULT_SKELETON_COUNT }).map((_, index) => (
          <Card key={`key-result-skeleton-${index}`} className="gap-4 py-4">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DetailViewSkeleton;
