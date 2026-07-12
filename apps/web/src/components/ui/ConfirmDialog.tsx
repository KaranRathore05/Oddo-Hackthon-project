import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './Dialog';
import { Button } from './Button';
import { AlertTriangle, Trash2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  isLoading,
}: ConfirmDialogProps) {
  const icons = {
    danger: <Trash2 className="w-6 h-6 text-crimson" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber" />,
    info: <Info className="w-6 h-6 text-cyan" />,
  };

  const buttonVariants = {
    danger: 'danger' as const,
    warning: 'primary' as const,
    info: 'primary' as const,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl',
              variant === 'danger' && 'bg-crimson/10',
              variant === 'warning' && 'bg-amber/10',
              variant === 'info' && 'bg-cyan/10',
            )}>
              {icons[variant]}
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={buttonVariants[variant]} onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
