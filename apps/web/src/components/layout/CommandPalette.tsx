import { useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Users, MapPin, Wrench,
  DollarSign, BarChart3, Search,
} from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

const navCommands = [
  { path: '/dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, group: 'Navigation' },
  { path: '/vehicles', label: 'Go to Vehicles', icon: Truck, group: 'Navigation' },
  { path: '/drivers', label: 'Go to Drivers', icon: Users, group: 'Navigation' },
  { path: '/trips', label: 'Go to Trips', icon: MapPin, group: 'Navigation' },
  { path: '/maintenance', label: 'Go to Maintenance', icon: Wrench, group: 'Navigation' },
  { path: '/finance', label: 'Go to Finance', icon: DollarSign, group: 'Navigation' },
  { path: '/reports', label: 'Go to Reports', icon: BarChart3, group: 'Navigation' },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Command palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2"
          >
            <Command
              className={cn(
                'overflow-hidden rounded-2xl',
                'bg-graphite/95 backdrop-blur-2xl border border-white/10',
                'shadow-glass-lg'
              )}
            >
              <div className="flex items-center gap-2 px-4 border-b border-white/[0.06]">
                <Search className="w-4 h-4 text-muted shrink-0" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="w-full py-4 bg-transparent text-sm text-white placeholder:text-muted/50 outline-none"
                />
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2 hide-scrollbar">
                <Command.Empty className="py-8 text-center text-sm text-muted">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                  {navCommands.map((cmd) => (
                    <Command.Item
                      key={cmd.path}
                      value={cmd.label}
                      onSelect={() => {
                        navigate(cmd.path);
                        setCommandPaletteOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer',
                        'text-sm text-white/70',
                        'data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white',
                        'transition-colors duration-100'
                      )}
                    >
                      <cmd.icon className="w-4 h-4 text-muted" strokeWidth={1.8} />
                      {cmd.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 text-2xs text-muted">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
