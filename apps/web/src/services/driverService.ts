export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
  safetyScore: number;
  totalTrips: number;
  avatar?: string;
}

export const driverService = {
  async getDrivers(): Promise<Driver[]> {
    return Promise.resolve([]);
  },

  async getDriverById(_id: string): Promise<Driver | null> {
    return Promise.resolve(null);
  },

  async createDriver(_driver: Partial<Driver>): Promise<Driver | null> {
    return Promise.resolve(null);
  },

  async updateDriver(_id: string, _driver: Partial<Driver>): Promise<Driver | null> {
    return Promise.resolve(null);
  },
};
