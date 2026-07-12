import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
        className
      )}
    />
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <AnimatePresence>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} asChild {...props}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
          animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-lg',
            'glass-card-strong p-6',
            'shadow-glass-lg',
            className
          )}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 text-muted hover:text-white hover:bg-white/5 transition-colors">
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </motion.div>
      </DialogPrimitive.Content>
    </AnimatePresence>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 space-y-1.5', className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold text-white', className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted', className)} {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogPortal,
};
