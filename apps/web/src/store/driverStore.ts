import { create } from 'zustand';
import type { Driver, DriverStatus } from '@/types';
import { isLicenseExpired } from '@/types';
import { driverService } from '@/services/driverService';

interface DriverState {
  drivers: Driver[];
  isLoading: boolean;
  error: string | null;
  fetchDrivers: () => Promise<void>;
  addDriver: (d: Omit<Driver, 'id' | 'created_at' | 'updated_at' | 'status' | 'safety_score'> & { safety_score?: number }) => Promise<Driver | { error: string }>;
  updateDriver: (id: string, data: Partial<Driver>) => Promise<Driver | { error: string }>;
  suspendDriver: (id: string) => Promise<Driver | { error: string }>;
  reinstateDriver: (id: string) => Promise<Driver | { error: string }>;
  getDriver: (id: string) => Driver | undefined;
  getAvailableDrivers: () => Driver[];
  getFilteredDrivers: (filters: { status?: DriverStatus; search?: string; licenseCategory?: string }) => Driver[];
}

export const useDriverStore = create<DriverState>()(
  (set, get) => ({
    drivers: [],
    isLoading: false,
    error: null,

    fetchDrivers: async () => {
      set({ isLoading: true, error: null });
      try {
        const drivers = await driverService.getDrivers();
        set({ drivers, isLoading: false });
      } catch (err: any) {
        set({ error: err?.error?.message || 'Failed to fetch drivers', isLoading: false });
      }
    },

    addDriver: async (data) => {
      try {
        const result = await driverService.createDriver(data);
        set((s) => ({ drivers: [...s.drivers, result] }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to add driver' };
      }
    },

    updateDriver: async (id, data) => {
      try {
        const result = await driverService.updateDriver(id, data);
        set((s) => ({ drivers: s.drivers.map(d => d.id === id ? result : d) }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to update driver' };
      }
    },

    suspendDriver: async (id) => {
      try {
        const result = await driverService.suspendDriver(id);
        set((s) => ({ drivers: s.drivers.map(d => d.id === id ? result : d) }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to suspend driver' };
      }
    },

    reinstateDriver: async (id) => {
      try {
        const result = await driverService.reinstateDriver(id);
        set((s) => ({ drivers: s.drivers.map(d => d.id === id ? result : d) }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to reinstate driver' };
      }
    },

    getDriver: (id) => get().drivers.find(d => d.id === id),

    getAvailableDrivers: () =>
      get().drivers.filter(d =>
        d.status === 'AVAILABLE' && !isLicenseExpired(d.license_expiry_date)
      ),

    getFilteredDrivers: ({ status, search, licenseCategory }) => {
      let result = get().drivers;
      if (status) result = result.filter(d => d.status === status);
      if (licenseCategory) result = result.filter(d => d.license_category === licenseCategory);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(d =>
          d.name.toLowerCase().includes(q) ||
          d.license_number.toLowerCase().includes(q) ||
          d.contact_number.includes(q)
        );
      }
      return result;
    },
  })
);
