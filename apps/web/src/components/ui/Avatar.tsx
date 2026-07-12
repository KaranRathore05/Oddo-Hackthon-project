import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

const Avatar = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    status?: 'online' | 'offline' | 'busy';
  }
>(({ className, status, ...props }, ref) => (
  <div className="relative inline-flex">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        'border border-white/10',
        className
      )}
      {...props}
    />
    {status && (
      <span
        className={cn(
          'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-charcoal',
          status === 'online' && 'bg-emerald',
          status === 'offline' && 'bg-muted',
          status === 'busy' && 'bg-crimson'
        )}
      />
    )}
  </div>
));
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full',
      'bg-gradient-to-br from-cyan/20 to-emerald/20 text-sm font-medium text-white',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
