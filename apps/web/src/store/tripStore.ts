import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Trip, TripStatus } from '@/types';
import { generateId, nowISO } from '@/types';
import { useVehicleStore } from './vehicleStore';
import { useDriverStore } from './driverStore';

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
  createTrip: (data: CreateTripInput) => Trip | { error: string };
  dispatchTrip: (id: string) => Trip | { error: string };
  completeTrip: (id: string, data: CompleteTripInput) => Trip | { error: string };
  cancelTrip: (id: string) => Trip | { error: string };
  getTrip: (id: string) => Trip | undefined;
  getFilteredTrips: (filters: { status?: TripStatus; search?: string }) => Trip[];
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],

      createTrip: (data) => {
        const vehicleStore = useVehicleStore.getState();
        const driverStore = useDriverStore.getState();

        // Validate vehicle exists and is available
        const vehicle = vehicleStore.getVehicle(data.vehicle_id);
        if (!vehicle) return { error: 'Vehicle not found.' };
        if (vehicle.status !== 'AVAILABLE') {
          return { error: `Vehicle "${vehicle.registration_number}" is not available (current status: ${vehicle.status}).` };
        }

        // Validate driver exists and is available
        const driver = driverStore.getDriver(data.driver_id);
        if (!driver) return { error: 'Driver not found.' };
        if (driver.status !== 'AVAILABLE') {
          return { error: `Driver "${driver.name}" is not available (current status: ${driver.status}).` };
        }

        // Check license expiry
        if (new Date(driver.license_expiry_date) < new Date()) {
          return { error: `Driver "${driver.name}" has an expired license (expired ${driver.license_expiry_date}).` };
        }

        // Check cargo weight vs capacity (Rule #5)
        if (data.cargo_weight_kg > vehicle.max_load_capacity_kg) {
          return {
            error: `Cargo weight ${data.cargo_weight_kg} kg exceeds vehicle capacity of ${vehicle.max_load_capacity_kg} kg. Capacity exceeded by ${data.cargo_weight_kg - vehicle.max_load_capacity_kg} kg — dispatch blocked!`,
          };
        }

        // Check vehicle/driver not already on an active trip (Rule #4)
        const activeTrips = get().trips.filter(t => t.status === 'DRAFT' || t.status === 'DISPATCHED');
        const vehicleInUse = activeTrips.find(t => t.vehicle_id === data.vehicle_id);
        if (vehicleInUse) {
          return { error: `Vehicle "${vehicle.registration_number}" is already assigned to an active trip.` };
        }
        const driverInUse = activeTrips.find(t => t.driver_id === data.driver_id);
        if (driverInUse) {
          return { error: `Driver "${driver.name}" is already assigned to an active trip.` };
        }

        const now = nowISO();
        const trip: Trip = {
          id: generateId(),
          source: data.source,
          destination: data.destination,
          vehicle_id: data.vehicle_id,
          driver_id: data.driver_id,
          cargo_weight_kg: data.cargo_weight_kg,
          planned_distance_km: data.planned_distance_km,
          revenue: data.revenue,
          status: 'DRAFT',
          created_by: data.created_by,
          created_at: now,
          updated_at: now,
        };

        set((s) => ({ trips: [...s.trips, trip] }));
        return trip;
      },

      dispatchTrip: (id) => {
        const trip = get().trips.find(t => t.id === id);
        if (!trip) return { error: 'Trip not found.' };

        // Rule #11: strict state machine
        if (trip.status !== 'DRAFT') {
          return { error: `Cannot dispatch a trip with status "${trip.status}". Only DRAFT trips can be dispatched.` };
        }

        // Rule #6: atomically set vehicle + driver to ON_TRIP
        const vehicleStore = useVehicleStore.getState();
        const driverStore = useDriverStore.getState();
        vehicleStore.setVehicleStatus(trip.vehicle_id, 'ON_TRIP');
        driverStore.setDriverStatus(trip.driver_id, 'ON_TRIP');

        const now = nowISO();
        const updated: Trip = { ...trip, status: 'DISPATCHED', dispatched_at: now, updated_at: now };
        set((s) => ({
          trips: s.trips.map(t => t.id === id ? updated : t),
        }));
        return updated;
      },

      completeTrip: (id, data) => {
        const trip = get().trips.find(t => t.id === id);
        if (!trip) return { error: 'Trip not found.' };

        // Rule #11: strict state machine
        if (trip.status !== 'DISPATCHED') {
          return { error: `Cannot complete a trip with status "${trip.status}". Only DISPATCHED trips can be completed.` };
        }

        // Rule #7: atomically restore vehicle + driver, update odometer
        const vehicleStore = useVehicleStore.getState();
        const driverStore = useDriverStore.getState();
        vehicleStore.setVehicleStatus(trip.vehicle_id, 'AVAILABLE');
        driverStore.setDriverStatus(trip.driver_id, 'AVAILABLE');
        if (data.actual_distance_km > 0) {
          vehicleStore.incrementOdometer(trip.vehicle_id, data.actual_distance_km);
        }

        const now = nowISO();
        const updated: Trip = {
          ...trip,
          status: 'COMPLETED',
          actual_distance_km: data.actual_distance_km,
          fuel_consumed_liters: data.fuel_consumed_liters,
          completed_at: now,
          updated_at: now,
        };
        set((s) => ({
          trips: s.trips.map(t => t.id === id ? updated : t),
        }));
        return updated;
      },

      cancelTrip: (id) => {
        const trip = get().trips.find(t => t.id === id);
        if (!trip) return { error: 'Trip not found.' };

        // Rule #11: strict state machine
        if (trip.status !== 'DISPATCHED') {
          return { error: `Cannot cancel a trip with status "${trip.status}". Only DISPATCHED trips can be cancelled.` };
        }

        // Rule #8: restore vehicle + driver to AVAILABLE
        const vehicleStore = useVehicleStore.getState();
        const driverStore = useDriverStore.getState();
        vehicleStore.setVehicleStatus(trip.vehicle_id, 'AVAILABLE');
        driverStore.setDriverStatus(trip.driver_id, 'AVAILABLE');

        const now = nowISO();
        const updated: Trip = { ...trip, status: 'CANCELLED', cancelled_at: now, updated_at: now };
        set((s) => ({
          trips: s.trips.map(t => t.id === id ? updated : t),
        }));
        return updated;
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
    }),
    { name: 'transitops-trips' }
  )
);
