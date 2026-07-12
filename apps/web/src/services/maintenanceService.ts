import { apiClient } from './apiClient';
import type { MaintenanceLog } from '@/types';

export const maintenanceService = {
  async getMaintenanceLogs(): Promise<MaintenanceLog[]> {
    return apiClient.get<MaintenanceLog[]>('/maintenance');
  },

  async getMaintenanceById(id: string): Promise<MaintenanceLog> {
    return apiClient.get<MaintenanceLog>(`/maintenance/${id}`);
  },

  async createMaintenanceLog(record: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    return apiClient.post<MaintenanceLog>('/maintenance', record);
  },

  async closeMaintenanceLog(id: string, data: { cost: number; description?: string }): Promise<MaintenanceLog> {
    return apiClient.request<MaintenanceLog>(`/maintenance/${id}/close`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
};
