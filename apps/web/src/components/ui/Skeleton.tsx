import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'h-10 w-10 rounded-full',
    rectangular: 'h-32 w-full rounded-xl',
  };

  return (
    <div
      className={cn(
        'shimmer',
        'rounded-lg',
        variants[variant],
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-6 rounded-lg" variant="rectangular" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-white/5 last:border-0">
          <div className="flex gap-4 items-center">
            <Skeleton variant="circular" className="h-8 w-8" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-3 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
