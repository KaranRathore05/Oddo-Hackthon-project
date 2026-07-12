import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative w-full">
        <div
          className={cn(
            'relative flex items-center rounded-xl border transition-all duration-200',
            'bg-white/[0.03] backdrop-blur-sm',
            isFocused
              ? 'border-cyan/40 shadow-[0_0_0_3px_rgba(0,212,255,0.08)]'
              : error
                ? 'border-crimson/40'
                : 'border-white/10 hover:border-white/20',
          )}
        >
          {icon && (
            <span className={cn(
              'pl-3.5 transition-colors duration-200',
              isFocused ? 'text-cyan' : 'text-muted'
            )}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-transparent px-3.5 py-3 text-sm text-white transition-colors',
              isFocused || !label ? 'placeholder:text-muted/50' : 'placeholder:text-transparent',
              'focus:outline-none',
              icon && 'pl-2',
              label && 'pt-5 pb-1.5',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {label && (
            <span
              className={cn(
                'absolute left-3.5 transition-all duration-200 pointer-events-none',
                icon && 'left-10',
                isFocused || hasValue
                  ? 'top-1.5 text-2xs font-medium text-cyan'
                  : 'top-1/2 -translate-y-1/2 text-sm text-muted/60'
              )}
            >
              {label}
            </span>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="mt-1.5 text-xs text-crimson pl-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input, type InputProps };
