export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'SCHEDULED' | 'EMERGENCY' | 'INSPECTION';
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  technicianName?: string;
}

export const maintenanceService = {
  async getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    return Promise.resolve([]);
  },

  async getMaintenanceById(_id: string): Promise<MaintenanceRecord | null> {
    return Promise.resolve(null);
  },

  async createMaintenanceRecord(_record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | null> {
    return Promise.resolve(null);
  },
};
