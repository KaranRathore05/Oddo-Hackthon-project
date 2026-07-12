import { apiClient } from './apiClient';
import type { Trip } from '@/types';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    return apiClient.get<Trip[]>('/trips');
  },

  async getTripById(id: string): Promise<Trip> {
    return apiClient.get<Trip>(`/trips/${id}`);
  },

  async createTrip(trip: Partial<Trip>): Promise<Trip> {
    return apiClient.post<Trip>('/trips', trip);
  },

  async dispatchTrip(id: string): Promise<Trip> {
    return apiClient.request<Trip>(`/trips/${id}/dispatch`, { method: 'PATCH' });
  },

  async completeTrip(id: string, data: { actual_distance_km: number; fuel_consumed_liters: number; revenue?: number }): Promise<Trip> {
    return apiClient.request<Trip>(`/trips/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async cancelTrip(id: string): Promise<Trip> {
    return apiClient.request<Trip>(`/trips/${id}/cancel`, { method: 'PATCH' });
  },
};
