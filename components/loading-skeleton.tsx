import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-40 border-b border-border/60 bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="size-9" />
      </div>
    </div>
  );
}

export function CityCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="size-7 rounded-full" />
      </div>
      <Skeleton className="h-12 w-28" />
      <Skeleton className="h-6 w-36 rounded-full" />
    </div>
  );
}

export function LandingSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-full max-w-xl sm:h-12" />
          <Skeleton className="h-9 w-3/4 max-w-md sm:h-12" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex flex-col gap-8">
          <Skeleton className="h-11 w-full max-w-md rounded-xl" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              <CityCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export function DetailSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 pb-16 pt-10 sm:gap-14 sm:px-6 sm:pt-16">
        <div className="flex flex-col gap-10 md:items-center">
          <div className="flex flex-col gap-3 md:items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-48 sm:h-32" />
            <Skeleton className="h-5 w-56" />
          </div>
          <div className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 sm:p-5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-72 w-full rounded-2xl sm:h-60" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-28" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 10 }, (_, i) => (
              <Skeleton key={i} className="h-[136px] w-[72px] shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-[264px] w-full rounded-2xl" />
        </div>
      </main>
    </>
  );
}
