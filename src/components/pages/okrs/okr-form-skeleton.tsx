import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const KEY_RESULT_SKELETON_COUNT = 2;

const OkrFormSkeleton = () => {
  return (
    <div className="space-y-4">
      <Card className="gap-4 py-4">
        <CardHeader>
          <CardTitle>ข้อมูล Objective</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 py-4">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="space-y-2">
            <CardTitle>Key Results</CardTitle>
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: KEY_RESULT_SKELETON_COUNT }).map((_, index) => (
            <div
              key={`okr-form-key-result-skeleton-${index}`}
              className="space-y-4 rounded-lg border border-border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {Array.from({ length: 5 }).map((__, fieldIndex) => (
                  <div key={`okr-form-field-skeleton-${index}-${fieldIndex}`} className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OkrFormSkeleton;
