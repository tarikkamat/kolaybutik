import { Skeleton } from '@/components/ui/skeleton';

export function ProductSkeletonCard() {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
            <Skeleton className="mb-4 h-48 w-full rounded-lg" />
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-2 h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
        </div>
    );
}
