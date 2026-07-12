import { create } from 'zustand';
import type { Trip, TripStatus } from '@/types';
import { useVehicleStore } from './vehicleStore';
import { useDriverStore } from './driverStore';
import { tripService } from '@/services/tripService';

interface CreateTripInput {
  source: string;
  destination: string;
  vehicle_id: string;
  driver_id: string;
  cargo_weight_kg: number;
  planned_distance_km: number;
  revenue?: number;
  created_by?: string;
}

interface CompleteTripInput {
  actual_distance_km: number;
  fuel_consumed_liters: number;
}

interface TripState {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  createTrip: (data: CreateTripInput) => Promise<Trip | { error: string }>;
  dispatchTrip: (id: string) => Promise<Trip | { error: string }>;
  completeTrip: (id: string, data: CompleteTripInput) => Promise<Trip | { error: string }>;
  cancelTrip: (id: string) => Promise<Trip | { error: string }>;
  getTrip: (id: string) => Trip | undefined;
  getFilteredTrips: (filters: { status?: TripStatus; search?: string }) => Trip[];
}

export const useTripStore = create<TripState>()(
  (set, get) => ({
    trips: [],
    isLoading: false,
    error: null,

    fetchTrips: async () => {
      set({ isLoading: true, error: null });
      try {
        const trips = await tripService.getTrips();
        set({ trips, isLoading: false });
      } catch (err: any) {
        set({ error: err?.error?.message || 'Failed to fetch trips', isLoading: false });
      }
    },

    createTrip: async (data) => {
      try {
        const result = await tripService.createTrip(data);
        set((s) => ({ trips: [...s.trips, result] }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to create trip' };
      }
    },

    dispatchTrip: async (id) => {
      try {
        const result = await tripService.dispatchTrip(id);
        set((s) => ({ trips: s.trips.map(t => t.id === id ? result : t) }));
        
        // Sync vehicle and driver states from backend
        useVehicleStore.getState().fetchVehicles();
        useDriverStore.getState().fetchDrivers();
        
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to dispatch trip' };
      }
    },

    completeTrip: async (id, data) => {
      try {
        const result = await tripService.completeTrip(id, data);
        set((s) => ({ trips: s.trips.map(t => t.id === id ? result : t) }));

        // Sync vehicle and driver states from backend
        useVehicleStore.getState().fetchVehicles();
        useDriverStore.getState().fetchDrivers();
        
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to complete trip' };
      }
    },

    cancelTrip: async (id) => {
      try {
        const result = await tripService.cancelTrip(id);
        set((s) => ({ trips: s.trips.map(t => t.id === id ? result : t) }));

        // Sync vehicle and driver states from backend
        useVehicleStore.getState().fetchVehicles();
        useDriverStore.getState().fetchDrivers();
        
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to cancel trip' };
      }
    },

    getTrip: (id) => get().trips.find(t => t.id === id),

    getFilteredTrips: ({ status, search }) => {
      let result = get().trips;
      if (status) result = result.filter(t => t.status === status);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(t =>
          t.source.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        );
      }
      return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  })
);
