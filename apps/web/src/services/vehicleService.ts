import { apiClient } from './apiClient';
import type { Vehicle } from '@/types';

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    return apiClient.get<Vehicle[]>('/vehicles');
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    return apiClient.get<Vehicle>(`/vehicles/${id}`);
  },

  async createVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return apiClient.post<Vehicle>('/vehicles', vehicle);
  },

  async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return apiClient.put<Vehicle>(`/vehicles/${id}`, vehicle);
  },

  async deleteVehicle(id: string): Promise<boolean> {
    await apiClient.delete(`/vehicles/${id}`);
    return true;
  },
  
  async retireVehicle(id: string): Promise<Vehicle> {
    return apiClient.request<Vehicle>(`/vehicles/${id}/retire`, { method: 'PATCH' });
  }
};
