import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, icon, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-cyan text-charcoal hover:bg-cyan-400 shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.25)]',
      secondary:
        'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20',
      ghost:
        'text-muted hover:text-white hover:bg-white/5',
      danger:
        'bg-crimson/10 text-crimson hover:bg-crimson/20 border border-crimson/20',
      outline:
        'bg-transparent text-cyan border border-cyan/30 hover:bg-cyan/5 hover:border-cyan/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'relative inline-flex items-center justify-center font-medium transition-all duration-500 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal',
          'disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export { Button, type ButtonProps };
