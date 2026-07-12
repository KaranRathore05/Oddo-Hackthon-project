export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  distance: number;
  fuelConsumed?: number;
  notes?: string;
}

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    return Promise.resolve([]);
  },

  async getTripById(_id: string): Promise<Trip | null> {
    return Promise.resolve(null);
  },

  async createTrip(_trip: Partial<Trip>): Promise<Trip | null> {
    return Promise.resolve(null);
  },

  async updateTrip(_id: string, _trip: Partial<Trip>): Promise<Trip | null> {
    return Promise.resolve(null);
  },
};
