import { apiClient } from './apiClient';
import type { Vehicle, VehicleDocument } from '@/types';

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
  },

  async getVehicleDocuments(id: string): Promise<VehicleDocument[]> {
    return apiClient.get<VehicleDocument[]>(`/vehicles/${id}/documents`);
  },

  async uploadVehicleDocument(id: string, file: File, title: string): Promise<VehicleDocument> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', title);
    return apiClient.post<VehicleDocument>(`/vehicles/${id}/documents`, formData);
  }
};
