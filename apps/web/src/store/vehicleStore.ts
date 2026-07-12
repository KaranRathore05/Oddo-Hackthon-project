import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Vehicle, VehicleStatus, VehicleType } from '@/types';
import { generateId, nowISO } from '@/types';

interface VehicleState {
  vehicles: Vehicle[];
  addVehicle: (v: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'status' | 'odometer_km'> & { odometer_km?: number }) => Vehicle | { error: string };
  updateVehicle: (id: string, data: Partial<Vehicle>) => Vehicle | { error: string };
  retireVehicle: (id: string) => Vehicle | { error: string };
  setVehicleStatus: (id: string, status: VehicleStatus) => void;
  incrementOdometer: (id: string, km: number) => void;
  getVehicle: (id: string) => Vehicle | undefined;
  getAvailableVehicles: () => Vehicle[];
  getFilteredVehicles: (filters: { status?: VehicleStatus; type?: VehicleType; region?: string; search?: string }) => Vehicle[];
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],

      addVehicle: (data) => {
        const existing = get().vehicles.find(v => v.registration_number === data.registration_number);
        if (existing) {
          return { error: `Vehicle with registration number "${data.registration_number}" already exists.` };
        }
        const now = nowISO();
        const vehicle: Vehicle = {
          id: generateId(),
          registration_number: data.registration_number,
          name_model: data.name_model,
          type: data.type,
          max_load_capacity_kg: data.max_load_capacity_kg,
          odometer_km: data.odometer_km ?? 0,
          acquisition_cost: data.acquisition_cost,
          status: 'AVAILABLE',
          region: data.region,
          created_at: now,
          updated_at: now,
        };
        set((s) => ({ vehicles: [...s.vehicles, vehicle] }));
        return vehicle;
      },

      updateVehicle: (id, data) => {
        const vehicles = get().vehicles;
        const idx = vehicles.findIndex(v => v.id === id);
        if (idx === -1) return { error: 'Vehicle not found.' };

        if (data.registration_number && data.registration_number !== vehicles[idx].registration_number) {
          const dup = vehicles.find(v => v.registration_number === data.registration_number && v.id !== id);
          if (dup) return { error: `Registration number "${data.registration_number}" is already in use.` };
        }

        const updated = { ...vehicles[idx], ...data, updated_at: nowISO() };
        const next = [...vehicles];
        next[idx] = updated;
        set({ vehicles: next });
        return updated;
      },

      retireVehicle: (id) => {
        const vehicles = get().vehicles;
        const v = vehicles.find(v => v.id === id);
        if (!v) return { error: 'Vehicle not found.' };
        if (v.status === 'ON_TRIP') return { error: 'Cannot retire a vehicle that is currently on a trip.' };
        return get().updateVehicle(id, { status: 'RETIRED' }) as Vehicle;
      },

      setVehicleStatus: (id, status) => {
        set((s) => ({
          vehicles: s.vehicles.map(v =>
            v.id === id ? { ...v, status, updated_at: nowISO() } : v
          ),
        }));
      },

      incrementOdometer: (id, km) => {
        set((s) => ({
          vehicles: s.vehicles.map(v =>
            v.id === id ? { ...v, odometer_km: v.odometer_km + km, updated_at: nowISO() } : v
          ),
        }));
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
    }),
    { name: 'transitops-vehicles' }
  )
);
