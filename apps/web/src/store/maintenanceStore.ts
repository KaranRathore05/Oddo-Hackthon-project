import { create } from 'zustand';
import type { MaintenanceLog, MaintenanceStatus } from '@/types';
import { useVehicleStore } from './vehicleStore';
import { maintenanceService } from '@/services/maintenanceService';

interface CreateMaintenanceInput {
  vehicle_id: string;
  type: string;
  description?: string;
  cost: number;
}

interface MaintenanceState {
  logs: MaintenanceLog[];
  isLoading: boolean;
  error: string | null;
  fetchMaintenanceLogs: () => Promise<void>;
  createLog: (data: CreateMaintenanceInput) => Promise<MaintenanceLog | { error: string }>;
  closeLog: (id: string) => Promise<MaintenanceLog | { error: string }>;
  getLog: (id: string) => MaintenanceLog | undefined;
  getLogsByVehicle: (vehicleId: string) => MaintenanceLog[];
  getFilteredLogs: (filters: { status?: MaintenanceStatus; search?: string; vehicleId?: string }) => MaintenanceLog[];
  getTotalMaintenanceCost: (vehicleId?: string) => number;
}

export const useMaintenanceStore = create<MaintenanceState>()(
  (set, get) => ({
    logs: [],
    isLoading: false,
    error: null,

    fetchMaintenanceLogs: async () => {
      set({ isLoading: true, error: null });
      try {
        const logs = await maintenanceService.getMaintenanceLogs();
        set({ logs, isLoading: false });
      } catch (err: any) {
        set({ error: err?.error?.message || 'Failed to fetch maintenance logs', isLoading: false });
      }
    },

    createLog: async (data) => {
      try {
        const vehicleStore = useVehicleStore.getState();
        const vehicle = vehicleStore.getVehicle(data.vehicle_id);
        if (!vehicle) return { error: 'Vehicle not found.' };
        if (vehicle.status === 'RETIRED') return { error: 'Cannot create maintenance for a retired vehicle.' };

        const result = await maintenanceService.createMaintenanceLog(data);
        set((s) => ({ logs: [...s.logs, result] }));
        
        // Sync vehicle state (backend sets it to IN_SHOP)
        vehicleStore.fetchVehicles();
        
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to create maintenance log' };
      }
    },

    closeLog: async (id) => {
      const log = get().logs.find(l => l.id === id);
      if (!log) return { error: 'Maintenance record not found.' };

      try {
        // Backend expects cost and description to close, we'll pass the existing cost
        const result = await maintenanceService.closeMaintenanceLog(id, { cost: log.cost, description: log.description });
        set((s) => ({ logs: s.logs.map(l => l.id === id ? result : l) }));

        // Sync vehicle state (backend restores it to AVAILABLE)
        useVehicleStore.getState().fetchVehicles();
        
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to close maintenance log' };
      }
    },

    getLog: (id) => get().logs.find(l => l.id === id),

    getLogsByVehicle: (vehicleId) =>
      get().logs.filter(l => l.vehicle_id === vehicleId),

    getFilteredLogs: ({ status, search, vehicleId }) => {
      let result = get().logs;
      if (status) result = result.filter(l => l.status === status);
      if (vehicleId) result = result.filter(l => l.vehicle_id === vehicleId);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(l =>
          l.type.toLowerCase().includes(q) ||
          (l.description ?? '').toLowerCase().includes(q)
        );
      }
      return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },

    getTotalMaintenanceCost: (vehicleId) => {
      const logs = vehicleId
        ? get().logs.filter(l => l.vehicle_id === vehicleId)
        : get().logs;
      return logs.reduce((sum, l) => sum + l.cost, 0);
    },
  })
);

