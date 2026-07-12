import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { useThemeStore } from '@/store/themeStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useDriverStore } from '@/store/driverStore';
import { useTripStore } from '@/store/tripStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useFinanceStore } from '@/store/financeStore';

export function AppLayout() {
  const { sidebarCollapsed } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    // Fetch initial data on mount
    useVehicleStore.getState().fetchVehicles();
    useDriverStore.getState().fetchDrivers();
    useTripStore.getState().fetchTrips();
    useMaintenanceStore.getState().fetchMaintenanceLogs();
    useFinanceStore.getState().fetchFinanceData();
  }, []);

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Noise texture overlay */}
      <div className="noise-texture" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen flex flex-col"
      >
        <Topbar />

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}
