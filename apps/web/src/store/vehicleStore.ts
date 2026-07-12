import { create } from 'zustand';
import type { Vehicle, VehicleStatus, VehicleType } from '@/types';
import { vehicleService } from '@/services/vehicleService';

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (v: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'status' | 'odometer_km'> & { odometer_km?: number }) => Promise<Vehicle | { error: string }>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<Vehicle | { error: string }>;
  retireVehicle: (id: string) => Promise<Vehicle | { error: string }>;
  getVehicle: (id: string) => Vehicle | undefined;
  getAvailableVehicles: () => Vehicle[];
  getFilteredVehicles: (filters: { status?: VehicleStatus; type?: VehicleType; region?: string; search?: string }) => Vehicle[];
}

export const useVehicleStore = create<VehicleState>()(
  (set, get) => ({
    vehicles: [],
    isLoading: false,
    error: null,

    fetchVehicles: async () => {
      set({ isLoading: true, error: null });
      try {
        const vehicles = await vehicleService.getVehicles();
        set({ vehicles, isLoading: false });
      } catch (err: any) {
        set({ error: err?.error?.message || 'Failed to fetch vehicles', isLoading: false });
      }
    },

    addVehicle: async (data) => {
      try {
        const result = await vehicleService.createVehicle(data);
        set((s) => ({ vehicles: [...s.vehicles, result] }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to add vehicle' };
      }
    },

    updateVehicle: async (id, data) => {
      try {
        const result = await vehicleService.updateVehicle(id, data);
        set((s) => ({ vehicles: s.vehicles.map(v => v.id === id ? result : v) }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to update vehicle' };
      }
    },

    retireVehicle: async (id) => {
      try {
        const result = await vehicleService.retireVehicle(id);
        set((s) => ({ vehicles: s.vehicles.map(v => v.id === id ? result : v) }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to retire vehicle' };
      }
    },

    getVehicle: (id) => get().vehicles.find(v => v.id === id),

    getAvailableVehicles: () =>
      get().vehicles.filter(v => v.status === 'AVAILABLE'),

    getFilteredVehicles: ({ status, type, region, search }) => {
      let result = get().vehicles;
      if (status) result = result.filter(v => v.status === status);
      if (type) result = result.filter(v => v.type === type);
      if (region) result = result.filter(v => v.region === region);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(v =>
          v.registration_number.toLowerCase().includes(q) ||
          v.name_model.toLowerCase().includes(q) ||
          (v.region ?? '').toLowerCase().includes(q)
        );
      }
      return result;
    },
  })
);
