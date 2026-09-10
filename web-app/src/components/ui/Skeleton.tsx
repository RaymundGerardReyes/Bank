import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`rounded-xl bg-secondary/15 relative overflow-hidden shimmer-bg ${className}`} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`p-6 bg-dominant rounded-2xl border border-secondary/20 shadow-sm flex flex-col gap-4 ${className}`}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="h-8 w-44" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="w-full flex flex-col gap-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-14 w-full flex items-center justify-between px-4 border border-secondary/15 rounded-xl bg-dominant">
        <div className="flex items-center gap-3 w-1/3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col gap-1.5 w-full">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-4 w-1/5 hidden sm:block" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);
