import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Driver, DriverStatus } from '@/types';
import { generateId, nowISO, isLicenseExpired } from '@/types';

interface DriverState {
  drivers: Driver[];
  addDriver: (d: Omit<Driver, 'id' | 'created_at' | 'updated_at' | 'status' | 'safety_score'> & { safety_score?: number }) => Driver | { error: string };
  updateDriver: (id: string, data: Partial<Driver>) => Driver | { error: string };
  suspendDriver: (id: string) => Driver | { error: string };
  reinstateDriver: (id: string) => Driver | { error: string };
  setDriverStatus: (id: string, status: DriverStatus) => void;
  getDriver: (id: string) => Driver | undefined;
  getAvailableDrivers: () => Driver[];
  getFilteredDrivers: (filters: { status?: DriverStatus; search?: string; licenseCategory?: string }) => Driver[];
}

export const useDriverStore = create<DriverState>()(
  persist(
    (set, get) => ({
      drivers: [],

      addDriver: (data) => {
        const existing = get().drivers.find(d => d.license_number === data.license_number);
        if (existing) {
          return { error: `Driver with license number "${data.license_number}" already exists.` };
        }
        const now = nowISO();
        const driver: Driver = {
          id: generateId(),
          name: data.name,
          license_number: data.license_number,
          license_category: data.license_category,
          license_expiry_date: data.license_expiry_date,
          contact_number: data.contact_number,
          safety_score: data.safety_score ?? 100,
          status: 'AVAILABLE',
          created_at: now,
          updated_at: now,
        };
        set((s) => ({ drivers: [...s.drivers, driver] }));
        return driver;
      },

      updateDriver: (id, data) => {
        const drivers = get().drivers;
        const idx = drivers.findIndex(d => d.id === id);
        if (idx === -1) return { error: 'Driver not found.' };

        if (data.license_number && data.license_number !== drivers[idx].license_number) {
          const dup = drivers.find(d => d.license_number === data.license_number && d.id !== id);
          if (dup) return { error: `License number "${data.license_number}" is already in use.` };
        }

        const updated = { ...drivers[idx], ...data, updated_at: nowISO() };
        const next = [...drivers];
        next[idx] = updated;
        set({ drivers: next });
        return updated;
      },

      suspendDriver: (id) => {
        const d = get().drivers.find(d => d.id === id);
        if (!d) return { error: 'Driver not found.' };
        if (d.status === 'ON_TRIP') return { error: 'Cannot suspend a driver who is currently on a trip.' };
        return get().updateDriver(id, { status: 'SUSPENDED' }) as Driver;
      },

      reinstateDriver: (id) => {
        const d = get().drivers.find(d => d.id === id);
        if (!d) return { error: 'Driver not found.' };
        if (d.status !== 'SUSPENDED' && d.status !== 'OFF_DUTY') {
          return { error: 'Driver is not suspended or off-duty.' };
        }
        return get().updateDriver(id, { status: 'AVAILABLE' }) as Driver;
      },

      setDriverStatus: (id, status) => {
        set((s) => ({
          drivers: s.drivers.map(d =>
            d.id === id ? { ...d, status, updated_at: nowISO() } : d
          ),
        }));
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
    }),
    { name: 'transitops-drivers' }
  )
);
