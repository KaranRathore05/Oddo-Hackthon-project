import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Drawer({ isOpen, onClose, title, children, side = 'right', className }: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 z-50 h-full w-full max-w-md',
              'bg-slate border-white/5',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-73px)] hide-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
