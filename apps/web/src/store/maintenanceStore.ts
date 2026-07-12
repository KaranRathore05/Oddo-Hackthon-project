import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MaintenanceLog, MaintenanceStatus } from '@/types';
import { generateId, nowISO } from '@/types';
import { useVehicleStore } from './vehicleStore';

interface CreateMaintenanceInput {
  vehicle_id: string;
  type: string;
  description?: string;
  cost: number;
}

interface MaintenanceState {
  logs: MaintenanceLog[];
  createLog: (data: CreateMaintenanceInput) => MaintenanceLog | { error: string };
  closeLog: (id: string) => MaintenanceLog | { error: string };
  getLog: (id: string) => MaintenanceLog | undefined;
  getLogsByVehicle: (vehicleId: string) => MaintenanceLog[];
  getFilteredLogs: (filters: { status?: MaintenanceStatus; search?: string; vehicleId?: string }) => MaintenanceLog[];
  getTotalMaintenanceCost: (vehicleId?: string) => number;
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      logs: [],

      createLog: (data) => {
        const vehicleStore = useVehicleStore.getState();
        const vehicle = vehicleStore.getVehicle(data.vehicle_id);
        if (!vehicle) return { error: 'Vehicle not found.' };
        if (vehicle.status === 'RETIRED') return { error: 'Cannot create maintenance for a retired vehicle.' };

        const now = nowISO();
        const log: MaintenanceLog = {
          id: generateId(),
          vehicle_id: data.vehicle_id,
          type: data.type,
          description: data.description,
          cost: data.cost,
          status: 'OPEN',
          opened_at: now,
          created_at: now,
          updated_at: now,
        };

        // Rule #9: auto-set vehicle to IN_SHOP
        vehicleStore.setVehicleStatus(data.vehicle_id, 'IN_SHOP');

        set((s) => ({ logs: [...s.logs, log] }));
        return log;
      },

      closeLog: (id) => {
        const log = get().logs.find(l => l.id === id);
        if (!log) return { error: 'Maintenance record not found.' };
        if (log.status === 'CLOSED') return { error: 'This maintenance record is already closed.' };

        const now = nowISO();
        const updated: MaintenanceLog = { ...log, status: 'CLOSED', closed_at: now, updated_at: now };

        // Rule #10: restore vehicle to AVAILABLE (unless RETIRED)
        const vehicleStore = useVehicleStore.getState();
        const vehicle = vehicleStore.getVehicle(log.vehicle_id);
        if (vehicle && vehicle.status !== 'RETIRED') {
          // Only restore if no other open maintenance logs exist for this vehicle
          const otherOpenLogs = get().logs.filter(
            l => l.vehicle_id === log.vehicle_id && l.id !== id && l.status === 'OPEN'
          );
          if (otherOpenLogs.length === 0) {
            vehicleStore.setVehicleStatus(log.vehicle_id, 'AVAILABLE');
          }
        }

        set((s) => ({
          logs: s.logs.map(l => l.id === id ? updated : l),
        }));
        return updated;
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
    }),
    { name: 'transitops-maintenance' }
  )
);
