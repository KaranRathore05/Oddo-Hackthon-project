export interface Expense {
  id: string;
  vehicleId: string;
  category: 'FUEL' | 'MAINTENANCE' | 'INSURANCE' | 'TOLL' | 'OTHER';
  amount: number;
  date: string;
  description: string;
  receiptUrl?: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerReading: number;
  date: string;
  station?: string;
}

export const financeService = {
  async getExpenses(): Promise<Expense[]> {
    return Promise.resolve([]);
  },

  async getFuelRecords(): Promise<FuelRecord[]> {
    return Promise.resolve([]);
  },

  async createExpense(_expense: Partial<Expense>): Promise<Expense | null> {
    return Promise.resolve(null);
  },

  async createFuelRecord(_record: Partial<FuelRecord>): Promise<FuelRecord | null> {
    return Promise.resolve(null);
  },
};
