import { apiClient } from './apiClient';
import type { Driver } from '@/types';

export const driverService = {
  async getDrivers(): Promise<Driver[]> {
    return apiClient.get<Driver[]>('/drivers');
  },

  async getDriverById(id: string): Promise<Driver> {
    return apiClient.get<Driver>(`/drivers/${id}`);
  },

  async createDriver(driver: Partial<Driver>): Promise<Driver> {
    return apiClient.post<Driver>('/drivers', driver);
  },

  async updateDriver(id: string, driver: Partial<Driver>): Promise<Driver> {
    return apiClient.put<Driver>(`/drivers/${id}`, driver);
  },
  
  async suspendDriver(id: string): Promise<Driver> {
    return apiClient.request<Driver>(`/drivers/${id}/suspend`, { method: 'PATCH' });
  },
  
  async reinstateDriver(id: string): Promise<Driver> {
    return apiClient.request<Driver>(`/drivers/${id}/reinstate`, { method: 'PATCH' });
  }
};
