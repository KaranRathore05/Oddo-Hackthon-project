import { cn } from '@/lib/utils';
import type { VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus } from '@/types';

type AllStatus = VehicleStatus | DriverStatus | TripStatus | MaintenanceStatus;

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot?: string }> = {
  // Vehicle
  AVAILABLE: { bg: 'bg-emerald/10', text: 'text-emerald', dot: 'bg-emerald' },
  ON_TRIP: { bg: 'bg-cyan/10', text: 'text-cyan', dot: 'bg-cyan' },
  IN_SHOP: { bg: 'bg-amber/10', text: 'text-amber', dot: 'bg-amber' },
  RETIRED: { bg: 'bg-muted/20', text: 'text-muted', dot: 'bg-muted' },
  // Driver
  OFF_DUTY: { bg: 'bg-muted/20', text: 'text-muted', dot: 'bg-muted' },
  SUSPENDED: { bg: 'bg-crimson/10', text: 'text-crimson', dot: 'bg-crimson' },
  // Trip
  DRAFT: { bg: 'bg-slate-600/20', text: 'text-slate-300', dot: 'bg-slate-400' },
  DISPATCHED: { bg: 'bg-cyan/10', text: 'text-cyan', dot: 'bg-cyan' },
  COMPLETED: { bg: 'bg-emerald/10', text: 'text-emerald', dot: 'bg-emerald' },
  CANCELLED: { bg: 'bg-crimson/10', text: 'text-crimson', dot: 'bg-crimson' },
  // Maintenance
  OPEN: { bg: 'bg-amber/10', text: 'text-amber', dot: 'bg-amber' },
  CLOSED: { bg: 'bg-emerald/10', text: 'text-emerald', dot: 'bg-emerald' },
};

interface StatusBadgeProps {
  status: AllStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = 'sm', showDot = true, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { bg: 'bg-muted/20', text: 'text-muted', dot: 'bg-muted' };
  const label = status.replace(/_/g, ' ');

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-lg font-medium capitalize',
      config.bg, config.text,
      size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-3 py-1 text-xs',
      className,
    )}>
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />}
      {label.toLowerCase()}
    </span>
  );
}
