import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Truck, Users, MapPin, Wrench,
  DollarSign, BarChart3, ChevronLeft, ChevronRight,
  Zap, Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/Tooltip';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vehicles', label: 'Vehicles', icon: Truck },
  { path: '/drivers', label: 'Drivers', icon: Users },
  { path: '/trips', label: 'Trips', icon: MapPin },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/finance', label: 'Finance', icon: DollarSign },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed left-0 top-0 z-30 h-screen flex flex-col',
          'bg-slate/80 backdrop-blur-xl border-r border-white/[0.06]',
          'shadow-[4px_0_24px_rgba(0,0,0,0.2)]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-emerald shrink-0">
            <Zap className="w-4 h-4 text-charcoal" strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold text-white whitespace-nowrap overflow-hidden"
              >
                Transit<span className="text-cyan">Ops</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const content = (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white bg-white/[0.06]'
                      : 'text-muted hover:text-white hover:bg-white/[0.03]',
                    sidebarCollapsed && 'justify-center px-0'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-cyan"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        'w-5 h-5 shrink-0 transition-colors',
                        isActive ? 'text-cyan' : 'text-muted group-hover:text-white'
                      )}
                      strokeWidth={1.8}
                    />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{content}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{content}</div>;
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 pb-4">
          <button
            onClick={toggleSidebar}
            className={cn(
              'flex items-center justify-center w-full py-2.5 rounded-xl',
              'text-muted hover:text-white hover:bg-white/[0.03]',
              'transition-all duration-200'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
