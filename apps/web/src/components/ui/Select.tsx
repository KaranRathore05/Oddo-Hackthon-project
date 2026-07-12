import { forwardRef, useState, type SelectHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon, options, placeholder, value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';

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
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              'w-full bg-transparent px-3.5 py-3 text-sm appearance-none transition-colors',
              hasValue ? 'text-white' : (isFocused || !label ? 'text-muted/50' : 'text-transparent'),
              'focus:outline-none cursor-pointer',
              icon && 'pl-2',
              label && 'pt-5 pb-1.5',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-slate text-muted">{placeholder}</option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-slate text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className={cn(
            'absolute right-3 w-4 h-4 pointer-events-none transition-colors',
            isFocused ? 'text-cyan' : 'text-muted'
          )} />
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

Select.displayName = 'Select';
export { Select, type SelectOption, type SelectProps };
