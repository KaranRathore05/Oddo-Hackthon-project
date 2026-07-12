import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'amber' | 'crimson';
  className?: string;
}

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number | string; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof value !== 'number') return;
    const numValue = value;
    const duration = 1500;
    const start = performance.now();
    const startValue = 0;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + (numValue - startValue) * eased);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value]);

  if (typeof value === 'string') {
    return <span>{prefix}{value}{suffix}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export function KPICard({
  title,
  value,
  suffix,
  prefix,
  trend,
  icon: Icon,
  color = 'cyan',
  className,
}: KPICardProps) {
  const colorMap = {
    cyan: {
      iconBg: 'bg-cyan/10',
      iconText: 'text-cyan',
      glow: 'group-hover:shadow-glow-cyan',
    },
    emerald: {
      iconBg: 'bg-emerald/10',
      iconText: 'text-emerald',
      glow: 'group-hover:shadow-glow-emerald',
    },
    amber: {
      iconBg: 'bg-amber/10',
      iconText: 'text-amber',
      glow: 'group-hover:shadow-glow-amber',
    },
    crimson: {
      iconBg: 'bg-crimson/10',
      iconText: 'text-crimson',
      glow: 'group-hover:shadow-glow-crimson',
    },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'group glass-card p-5 transition-all duration-500 ease-out',
        colors.glow,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">{title}</p>
        <div className={cn('p-2 rounded-lg', colors.iconBg)}>
          <Icon className={cn('h-4 w-4', colors.iconText)} strokeWidth={2} />
        </div>
      </div>

      <div className="text-3xl font-bold text-white tracking-tight mb-2">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>

      {trend && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' ? 'text-emerald' : 'text-crimson'
            )}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-2xs text-muted">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
