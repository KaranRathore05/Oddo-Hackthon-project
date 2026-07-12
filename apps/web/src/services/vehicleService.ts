export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  type: 'BUS' | 'TRUCK' | 'VAN' | 'CAR';
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE' | 'RETIRED';
  fuelType: 'DIESEL' | 'PETROL' | 'ELECTRIC' | 'HYBRID';
  mileage: number;
  lastServiceDate: string;
  assignedDriverId?: string;
}

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    return Promise.resolve([]);
  },

  async getVehicleById(_id: string): Promise<Vehicle | null> {
    return Promise.resolve(null);
  },

  async createVehicle(_vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
    return Promise.resolve(null);
  },

  async updateVehicle(_id: string, _vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
    return Promise.resolve(null);
  },

  async deleteVehicle(_id: string): Promise<boolean> {
    return Promise.resolve(false);
  },
};
