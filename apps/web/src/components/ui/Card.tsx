import { type HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'interactive';
  glow?: 'cyan' | 'emerald' | 'amber' | 'crimson' | 'none';
  noPadding?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glow = 'none', noPadding = false, children, ...props }, ref) => {
    const glowStyles = {
      cyan: 'hover:shadow-glow-cyan hover:border-cyan/15',
      emerald: 'hover:shadow-glow-emerald hover:border-emerald/15',
      amber: 'hover:shadow-glow-amber hover:border-amber/15',
      crimson: 'hover:shadow-glow-crimson hover:border-crimson/15',
      none: '',
    };

    if (variant === 'interactive') {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn(
            'glass-card-hover',
            !noPadding && 'p-6',
            glowStyles[glow],
            className
          )}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          variant === 'strong' ? 'glass-card-strong' : 'glass-card',
          !noPadding && 'p-6',
          'transition-all duration-500 ease-out',
          glowStyles[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-medium text-muted uppercase tracking-wider', className)} {...props}>
      {children}
    </h3>
  );
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent, type CardProps };
