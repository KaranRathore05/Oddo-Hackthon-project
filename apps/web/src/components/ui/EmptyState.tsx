import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import {
  Truck, Users, MapPin, Wrench, DollarSign, BarChart3,
  type LucideIcon,
} from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

const iconMap: Record<string, LucideIcon> = {
  vehicles: Truck,
  drivers: Users,
  trips: MapPin,
  maintenance: Wrench,
  finance: DollarSign,
  reports: BarChart3,
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const FallbackIcon = Icon || Truck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'default' ? 'py-20 px-8' : 'py-10 px-4',
        className
      )}
    >
      {/* Animated icon container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 rounded-full bg-cyan/5 blur-2xl scale-150" />
        <div className={cn(
          'relative flex items-center justify-center rounded-2xl',
          'bg-gradient-to-br from-white/[0.06] to-white/[0.02]',
          'border border-white/[0.08]',
          variant === 'default' ? 'h-20 w-20' : 'h-14 w-14',
        )}>
          <FallbackIcon
            className={cn(
              'text-muted/60',
              variant === 'default' ? 'h-9 w-9' : 'h-6 w-6',
            )}
            strokeWidth={1.5}
          />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          'font-semibold text-white/90 mb-2',
          variant === 'default' ? 'text-lg' : 'text-base',
        )}
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          'text-muted max-w-sm',
          variant === 'default' ? 'text-sm' : 'text-xs',
        )}
      >
        {description}
      </motion.p>

      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export { iconMap };
