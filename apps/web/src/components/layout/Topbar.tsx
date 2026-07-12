import { useLocation } from 'react-router-dom';
import { Search, Bell, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/DropdownMenu';
import { useAuthStore } from '@/store/authStore';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vehicles': 'Vehicles',
  '/drivers': 'Drivers',
  '/trips': 'Trips',
  '/maintenance': 'Maintenance',
  '/finance': 'Finance',
  '/reports': 'Reports',
};

export function Topbar() {
  const location = useLocation();
  const { setCommandPaletteOpen, sidebarCollapsed } = useThemeStore();
  const { user, logout } = useAuthStore();

  const currentTitle = routeTitles[location.pathname] || 'TransitOps';

  return (
    <header
      className={cn(
        'sticky top-0 z-20 h-16 flex items-center justify-between px-6',
        'bg-charcoal/80 backdrop-blur-xl border-b border-white/[0.04]',
      )}
    >
      {/* Left: Page title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">{currentTitle}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search / Command Palette trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl',
            'bg-white/[0.03] border border-white/[0.06]',
            'text-sm text-muted hover:text-white hover:border-white/10',
            'transition-all duration-500 ease-out'
          )}
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.05] text-2xs text-muted">
            <Command className="w-3 h-3" />K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className={cn(
            'relative p-2 rounded-xl text-muted hover:text-white hover:bg-white/[0.03]',
            'transition-all duration-500 ease-out'
          )}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan animate-pulse-soft" />
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full ring-2 ring-transparent hover:ring-white/10 transition-all duration-500 ease-out">
              <Avatar status="online">
                <AvatarFallback>
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user?.name || 'Admin User'}</span>
                <span className="text-2xs text-muted">{user?.email || 'admin@transitops.io'}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-crimson hover:!text-crimson">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
