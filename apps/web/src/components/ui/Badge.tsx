import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'active' | 'warning' | 'danger' | 'info' | 'neutral';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', pulse = false, children, className }: BadgeProps) {
  const variants = {
    active: 'status-pill-active',
    warning: 'status-pill-warning',
    danger: 'status-pill-danger',
    info: 'status-pill-info',
    neutral: 'status-pill-neutral',
  };

  const dotColors = {
    active: 'bg-emerald',
    warning: 'bg-amber',
    danger: 'bg-crimson',
    info: 'bg-cyan',
    neutral: 'bg-muted',
  };

  return (
    <span className={cn(variants[variant], className)}>
      {pulse ? (
        <span className={cn('pulse-dot', dotColors[variant])} />
      ) : (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
